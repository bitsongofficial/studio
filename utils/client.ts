import { S3Client } from '@aws-sdk/client-s3';

export const getS3Client = () => {
  const { awsS3AccessKeyId, awsS3SecretAccessKey, awsS3Region } = useRuntimeConfig();

  return new S3Client({
    region: awsS3Region,
    credentials: {
      accessKeyId: awsS3AccessKeyId,
      secretAccessKey: awsS3SecretAccessKey,
    },
  });
}