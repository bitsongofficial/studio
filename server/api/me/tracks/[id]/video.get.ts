import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { ensureUserTrack } from "~/server/utils/media"

export default defineEventHandler(async (event) => {
  const { track } = await ensureUserTrack(event)

  const url = await getSignedUrl(
    getS3Client(),
    new GetObjectCommand({
      Bucket: useRuntimeConfig().awsS3BucketTracks,
      Key: `${track.video}`,
    }),
    {
      expiresIn: 1 * 60 * 60, // 1 hour
    },
  )

  await sendRedirect(event, url)
})