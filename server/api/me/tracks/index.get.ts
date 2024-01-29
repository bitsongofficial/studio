import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const tracks = await prisma.tracks.findMany({
    where: {
      user_id: user.userId
    },
    select: {
      id: true,
      title: true,
      artwork: true,
    },
    take: 10,
    orderBy: {
      created_at: 'desc'
    }
  })

  return Promise.all(tracks.map(async (track) => {
    if (track.artwork) {
      const url = await getSignedUrl(
        getS3Client(),
        new GetObjectCommand({
          Bucket: useRuntimeConfig().awsS3BucketTracks,
          Key: `${track.artwork}`,
        }),
        {
          expiresIn: 1 * 60 * 60, // 1 hour
        },
      )
      return {
        ...track,
        artwork: url
      }
    }
    return track
  }))
})