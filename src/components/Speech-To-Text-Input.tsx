import { useState, useEffect } from "react";
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  LanguageCode,
} from "@aws-sdk/client-transcribe-streaming";
import { Mic, MicOff } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  RecordingProperties,
  MessageDataType,
  LiveTranscriptionProps,
} from "../types";

const sampleRate = import.meta.env.VITE_TRANSCRIBE_SAMPLING_RATE;
const language = import.meta.env.VITE_TRANSCRIBE_LANGUAGE_CODE as LanguageCode;
const audiosource = import.meta.env.VITE_TRANSCRIBE_AUDIO_SOURCE;

// Helper function to PCM encode audio
const pcmEncode = (input: Float32Array) => {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
};

// Custom async iterator for message events
const createMessageIterator = (port: MessagePort) => {
  const queue: MessageEvent[] = [];
  let resolve: ((value: MessageEvent) => void) | null = null;

  const listener = (event: MessageEvent) => {
    if (resolve) {
      resolve(event);
      resolve = null;
    } else {
      queue.push(event);
    }
  };

  port.addEventListener("message", listener);

  return {
    [Symbol.asyncIterator]() {
      return {
        next: () => {
          return new Promise<IteratorResult<MessageEvent>>((res) => {
            if (queue.length > 0) {
              const event = queue.shift()!;
              res({ value: event, done: false });
            } else {
              resolve = (event) => res({ value: event, done: false });
            }
          });
        },
        return: () => {
          port.removeEventListener("message", listener);
          return Promise.resolve({ value: undefined, done: true });
        },
      };
    },
  };
};

// Speech-to-Text Input Component
export function SpeechToTextInput({
  inputType,
  value,
  onValueChange,
}: {
  inputType: "title" | "description";
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribeClient, setTranscribeClient] =
    useState<TranscribeStreamingClient | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<AudioWorkletNode | null>(
    null
  );

  // Clean up function to stop recording
  const stopStreaming = async (
    mediaRecorder: AudioWorkletNode,
    transcribeClient: { destroy: () => void }
  ) => {
    if (mediaRecorder) {
      mediaRecorder.port.postMessage({
        message: "UPDATE_RECORDING_STATE",
        setRecording: false,
      });
      mediaRecorder.port.close();
      mediaRecorder.disconnect();
    } else {
      console.log("no media recorder available to stop");
    }

    if (transcribeClient) {
      transcribeClient.destroy();
    }
  };

  // Start streaming transcription
  const startStreaming = async (
    handleTranscribeOutput: (
      data: string,
      partial: boolean,
      transcriptionClient: TranscribeStreamingClient,
      mediaRecorder: AudioWorkletNode
    ) => void
  ) => {
    const audioContext = new window.AudioContext();
    let stream: MediaStream;

    stream = await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    const source1 = audioContext.createMediaStreamSource(stream);

    const recordingprops: RecordingProperties = {
      numberOfChannels: 1,
      sampleRate: audioContext.sampleRate,
      maxFrameCount: (audioContext.sampleRate * 1) / 10,
    };

    try {
      await audioContext.audioWorklet.addModule(
        "../../public/worklets/recording-processor.js"
      );
    } catch (error) {
      console.log(`Add module error ${error}`);
    }
    const mediaRecorder = new AudioWorkletNode(
      audioContext,
      "recording-processor",
      {
        processorOptions: recordingprops,
      }
    );

    const destination = audioContext.createMediaStreamDestination();

    mediaRecorder.port.postMessage({
      message: "UPDATE_RECORDING_STATE",
      setRecording: true,
    });

    source1.connect(mediaRecorder).connect(destination);
    mediaRecorder.port.onmessageerror = (error) => {
      console.log(`Error receving message from worklet ${error}`);
    };

    const audioDataIterator = createMessageIterator(mediaRecorder.port);

    const getAudioStream = async function* () {
      for await (const chunk of audioDataIterator) {
        if (chunk.data.message === "SHARE_RECORDING_BUFFER") {
          const abuffer = pcmEncode(chunk.data.buffer[0]);
          const audiodata = new Uint8Array(abuffer);
          // console.log(`processing chunk of size ${audiodata.length}`);
          yield {
            AudioEvent: {
              AudioChunk: audiodata,
            },
          };
        }
      }
    };
    const transcribeClient = new TranscribeStreamingClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: import.meta.env.VITE_TRANSCRIBE_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_TRANSCRIBE_SECRET_ACCESS_KEY,
      },
    });

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: sampleRate,
      AudioStream: getAudioStream(),
    });
    const data = await transcribeClient.send(command);
    console.log("Transcribe sesssion established ", data.SessionId);

    if (data.TranscriptResultStream) {
      for await (const event of data.TranscriptResultStream) {
        if (event?.TranscriptEvent?.Transcript) {
          for (const result of event?.TranscriptEvent?.Transcript.Results ||
            []) {
            if (result?.Alternatives && result?.Alternatives[0].Items) {
              let completeSentence = ``;
              for (let i = 0; i < result?.Alternatives[0].Items?.length; i++) {
                completeSentence += ` ${result?.Alternatives[0].Items[i].Content}`;
              }
              // console.log(`Transcription: ${completeSentence}`);
              handleTranscribeOutput(
                completeSentence,
                result.IsPartial || false,
                transcribeClient,
                mediaRecorder
              );
            }
          }
        }
      }
    }
  };

  // Toggle recording
  const handleTranscribeOutput = (
    data: string,
    partial: boolean,
    transcriptionClient: TranscribeStreamingClient,
    mediaRecorder: AudioWorkletNode
  ) => {
    onValueChange(data);
  };

  const toggleRecording = async () => {
    console.log("toggle recording");
    if (isRecording) {
        if (mediaRecorder && transcribeClient) {
          await stopStreaming(mediaRecorder, transcribeClient);
        }
      console.log("stopped recording");
    } else {
      setIsRecording(true);
      await startStreaming(handleTranscribeOutput);
      console.log("started recording");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && transcribeClient) {
        stopStreaming(mediaRecorder, transcribeClient);
      }
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={toggleRecording}
        className={isRecording ? "text-red-500" : ""}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
