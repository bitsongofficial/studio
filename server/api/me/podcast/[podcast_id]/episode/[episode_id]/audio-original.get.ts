import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from '@prisma/client';
import { getS3Client } from '~/utils/client';

export default defineEventHandler(async (event) => {
  const podcast_id = getRouterParam(event, 'podcast_id')
  const episode_id = getRouterParam(event, 'episode_id')

  if (!podcast_id || !episode_id) {
    throw createError({
      message: 'Missing params',
      status: 400
    })
  }

  const user = await ensureAuth(event)

  const prismaClient = new PrismaClient();
  const episode = await prismaClient.episode.findUnique({
    where: {
      id: episode_id,
      AND: {
        podcast_id,
        user_id: user.userId
      }
    }
  })

  if (!episode) {
    throw createError({
      message: 'Episode not found',
      status: 404
    })
  }

  const { awsS3BucketPodcast } = useRuntimeConfig();

  // get signed url
  const command = new GetObjectCommand({
    Bucket: awsS3BucketPodcast,
    Key: episode.audio,
  });

  const s3 = getS3Client()
  const url = await getSignedUrl(s3, command, { expiresIn: 4 * 60 * 60 }) // 4 hour

  return {
    url,
  }
})