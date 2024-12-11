import { useState, useEffect } from "react";
import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
  LanguageCode,
} from "@aws-sdk/client-transcribe-streaming";
import { Mic, MicOff } from "lucide-react";
import { Button } from "../components/ui/button";

// Configuration
const sampleRate = import.meta.env.VITE_TRANSCRIBE_SAMPLING_RATE || 44100;
const language = (import.meta.env.VITE_TRANSCRIBE_LANGUAGE_CODE ||
  "en-US") as LanguageCode;

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
  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.port.postMessage({
        message: "UPDATE_RECORDING_STATE",
        setRecording: false,
      });
      mediaRecorder.port.close();
      mediaRecorder.disconnect();
    }

    if (transcribeClient) {
      transcribeClient.destroy();
    }

    setIsRecording(false);
    setMediaRecorder(null);
    setTranscribeClient(null);
  };

  // Start streaming transcription
  const startStreaming = async () => {
    try {
      const audioContext = new window.AudioContext();
      let stream: MediaStream;

      // Get audio input (microphone)
      stream = await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      const source1 = audioContext.createMediaStreamSource(stream);

      const recordingProps = {
        numberOfChannels: 1,
        sampleRate: audioContext.sampleRate,
        maxFrameCount: (audioContext.sampleRate * 1) / 10,
      };

      // Add audio worklet module
      await audioContext.audioWorklet.addModule(
        "../../public/worklets/recording-processor.js"
      );

      const newMediaRecorder = new AudioWorkletNode(
        audioContext,
        "recording-processor",
        {
          processorOptions: recordingProps,
        }
      );

      const destination = audioContext.createMediaStreamDestination();

      newMediaRecorder.port.postMessage({
        message: "UPDATE_RECORDING_STATE",
        setRecording: true,
      });

      source1.connect(newMediaRecorder).connect(destination);

      // Setup audio data iterator
      const audioDataIterator = createMessageIterator(newMediaRecorder.port);

      const getAudioStream = async function* () {
        for await (const chunk of audioDataIterator) {
          if (chunk.data.message === "SHARE_RECORDING_BUFFER") {
            const abuffer = pcmEncode(chunk.data.buffer[0]);
            const audiodata = new Uint8Array(abuffer);
            yield {
              AudioEvent: {
                AudioChunk: audiodata,
              },
            };
          }
        }
      };

      // Create Transcribe client
      const client = new TranscribeStreamingClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: import.meta.env.VITE_TRANSCRIBE_ACCESS_KEY_ID,
          secretAccessKey: import.meta.env.VITE_TRANSCRIBE_SECRET_ACCESS_KEY,
        },
      });
      console.log(
        import.meta.env.VITE_TRANSCRIBE_ACCESS_KEY_ID,
        import.meta.env.VITE_TRANSCRIBE_SECRET_ACCESS_KEY
      );
      setTranscribeClient(client);
      setMediaRecorder(newMediaRecorder);

      // Start transcription
      const command = new StartStreamTranscriptionCommand({
        LanguageCode: language,
        MediaEncoding: "pcm",
        MediaSampleRateHertz: sampleRate,
        AudioStream: getAudioStream(),
      });

      const data = await client.send(command);

      if (data.TranscriptResultStream) {
        for await (const event of data.TranscriptResultStream) {
          if (event?.TranscriptEvent?.Transcript) {
            for (const result of event?.TranscriptEvent?.Transcript.Results ||
              []) {
              if (result?.Alternatives && result?.Alternatives[0].Items) {
                let completeSentence = ``;
                for (
                  let i = 0;
                  i < result?.Alternatives[0].Items?.length;
                  i++
                ) {
                  completeSentence += ` ${result?.Alternatives[0].Items[i].Content}`;
                }
                // Debug: Log all transcription results
                console.log("Transcription Result:", {
                  completeSentence: completeSentence.trim(),
                  isPartial: result.IsPartial,
                });
                // Only update if it's a final transcription
                if (!result.IsPartial) {
                  onValueChange(value + " " + completeSentence.trim());
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Transcription error:", error);
      await stopRecording();
    }
  };

  // Toggle recording
  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      setIsRecording(true);
      await startStreaming();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
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
