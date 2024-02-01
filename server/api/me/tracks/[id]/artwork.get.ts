import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { ensureUserTrack } from "~/server/utils/media"

export default defineEventHandler(async (event) => {
  const { track } = await ensureUserTrack(event)

  if (!track.artwork) {
    createError({
      statusCode: 404,
      message: 'Artwork not found',
    })
  }

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

  return sendRedirect(event, url)
  // return sendProxy(event, url, {
  //   cookieDomainRewrite: '',
  //   cookiePathRewrite: '',
  //   sendStream: true,
  // })
})