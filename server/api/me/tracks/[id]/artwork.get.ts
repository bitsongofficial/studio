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
  })

  if (!track) {
    throw createError({
      message: 'No track found',
      status: 404
    })
  }

  // TODO: check if track exists, and if user is the owner

  const url = await getSignedUrl(
    getS3Client(),
    new GetObjectCommand({
      Bucket: useRuntimeConfig().awsS3BucketTracks,
      Key: `${user.userId}/tracks/original/${id}/artwork.jpg`,
    }),
    {
      expiresIn: 1 * 60 * 60, // 1 hour
    },
  )

  return {
    url,
  }
})