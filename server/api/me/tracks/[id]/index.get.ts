import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'No id',
      status: 400
    })
  }

  const track = await prisma.tracks.findUnique({
    where: {
      id,
      user_id: user.userId,
    },
    include: {
      artists: true,
    }
  })

  if (!track) {
    throw createError({
      message: 'No track found',
      status: 404
    })
  }

  let artwork;

  if (track.artwork) {
    artwork = await getSignedUrl(
      getS3Client(),
      new GetObjectCommand({
        Bucket: useRuntimeConfig().awsS3BucketTracks,
        Key: `${track.artwork}`,
      }),
      {
        expiresIn: 4 * 60 * 60, // 4 hour
      },
    )
  }

  return { ...track, artwork }
})