import { PutObjectCommand } from "@aws-sdk/client-s3";
import { fileTypeFromFile } from 'file-type';
import { getS3Client } from "~/utils";
import * as fs from 'fs';

type BaseStoreToS3Args = {
  userId: string;
  filepath: string;
  filename: string;
};

type StorePodcastEpisodeToS3Args = BaseStoreToS3Args
type StorePodcastImageToS3Args = BaseStoreToS3Args

type StoreFileResponse = {
  path: string;
  contenType: string;
}

export async function storePodcastEpisodeToS3(data: StorePodcastEpisodeToS3Args): Promise<StoreFileResponse> {
  const file = fs.readFileSync(data.filepath)
  const fileType = await fileTypeFromFile(data.filepath);
  if (!fileType) {
    throw new Error('File type not detected');
  }

  const fileName = `${data.userId}/podcast/episodes/original/${data.filename}`;

  await getS3Client().send(new PutObjectCommand({
    Body: file,
    Bucket: useRuntimeConfig().awsS3BucketPodcast,
    Key: fileName,
    ContentType: fileType.mime,
  }));

  return {
    path: fileName,
    contenType: fileType.mime,
  }
}

export async function storePodcastImageToS3(data: StorePodcastImageToS3Args): Promise<StoreFileResponse> {
  const file = fs.readFileSync(data.filepath)
  const fileType = await fileTypeFromFile(data.filepath);
  if (!fileType) {
    throw new Error('File type not detected');
  }
  const fileName = `${data.userId}/podcast/artwork${fileType.ext}`;

  await getS3Client().send(new PutObjectCommand({
    Body: file,
    Key: fileName,
    Bucket: useRuntimeConfig().awsS3BucketPodcast,
    ContentType: fileType.mime,
  }));

  return {
    path: fileName,
    contenType: fileType.mime,
  }
}