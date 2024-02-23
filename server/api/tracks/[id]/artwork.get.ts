import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const baseUrl = 'http://localhost:3000'

  const track = await event.context.database.tracks.findUnique({
    where: {
      id
    },
    select: {
      artwork: true
    }
  })

  if (!track) throw createError({ status: 404, message: "Track not found" })
  if (!track.artwork) return sendProxy(event, baseUrl + '/images/default.png')

  const bucket = useRuntimeConfig().awsS3BucketTracks
  const signedUrl = await getSignedUrl(
    getS3Client(),
    new GetObjectCommand({
      Bucket: bucket,
      Key: track.artwork,
    }),
    {
      expiresIn: 1 * 60 * 60, // 1 hour
    },
  )

  return sendProxy(event, signedUrl)
})