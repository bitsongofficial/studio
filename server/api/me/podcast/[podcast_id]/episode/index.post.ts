import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { ensureAuth } from '~/server/utils/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getS3Client } from '~/utils/client';

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const podcast_id = getRouterParam(event, 'podcast_id')
  if (!podcast_id) {
    throw createError({
      message: 'Missing podcast id',
      status: 400
    })
  }

  const podcast = await prismaClient.podcast.findUnique({
    where: {
      id: podcast_id,
      AND: {
        user_id: user.userId
      }
    },
  })

  if (!podcast) {
    throw createError({
      message: 'Podcast not found',
      status: 404
    })
  }

  const data = await readMultipartFormData(event)
  if (data === undefined || data.length === 0) {
    throw createError({
      message: 'No data',
      status: 400
    })
  }

  const file = data.find((item) => item.name === 'file')
  if (!file) {
    throw createError({
      message: 'No file',
      status: 400
    })
  }

  if (!file.type?.startsWith('audio/')) {
    throw createError({
      message: 'No audio file detected',
      status: 400
    })
  }

  try {
    const episodeId = uuidv4();
    const fileExtension = file!.type.split('/')[1];
    const fileName = `${user.userId}/podcast/episodes/original/${episodeId}.${fileExtension}`;
    const { awsS3BucketPodcast } = useRuntimeConfig();

    const command = new PutObjectCommand({
      Bucket: awsS3BucketPodcast,
      Key: fileName,
      Body: file!.data,
      ContentType: file!.type,
    });

    const s3 = getS3Client()
    await s3.send(command);

    const episode = await prismaClient.episode.create({
      data: {
        podcast_id,
        format: file?.type ? file.type : 'unknown',
        plays: 0,
        length: 0,
        audio: fileName,
        status: 'DRAFT',
        user_id: user.userId,
      },
    })

    return {
      episode,
    }
  } catch (e) {
    if (e instanceof ZodError) {
      throw createError({
        message: e.issues[0].message,
        status: 400
      })
    }

    console.log(e)

    throw createError({
      message: 'Something went wrong',
      status: 500
    })
  }
})