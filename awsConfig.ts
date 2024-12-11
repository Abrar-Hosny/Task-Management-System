import AWS from 'aws-sdk';

// Define the shape of environment variables for TypeScript
interface ProcessEnv {
  REACT_APP_AWS_REGION: string;
  REACT_APP_AWS_ACCESS_KEY: string;
  REACT_APP_AWS_SECRET_KEY: string;
  REACT_APP_SNS_TOPIC_ARN: string;

  // Add other variables here if needed
}

declare const process: {
  env: ProcessEnv;
};

// Update AWS SDK configuration with environment variables
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  

  logger: console, // Enable logging for debugging
});

export default AWS;
