import { storeTrackImageToS3, storeTrackVideoToS3 } from '~/server/services/s3';

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)
  const id = getRouterParam(event, 'id')

  console.log('id', id)

  // TODO: check if track exists, and if user is the owner

  const { files } = await readForm(event, {
    maxFileSize: 300 * 1024 * 1024, // 300MB
    maxFieldsSize: 0,
    maxFields: 0,
    maxFiles: 1,
    keepExtensions: true,
  })

  const _file = Array.isArray(files.video) ? files.video[0] : files.video
  if (!_file || _file.originalFilename === null || _file.mimetype === null) {
    throw createError({
      message: 'No file',
      status: 400
    })
  }

  console.log(_file.mimetype)

  if (!_file.mimetype.startsWith('video/')) {
    throw createError({
      message: 'No video file',
      status: 400
    })
  }

  try {
    const fileExtension = _file.originalFilename.split('.').pop()
    const newFilename = `video.${fileExtension}`

    const { contenType: content_type, path: video } = await storeTrackVideoToS3({
      userId: user.userId,
      id: id!,
      filepath: _file.filepath,
      filename: newFilename,
    })

    console.log('video', video)
    console.log('content_type', content_type)
  } catch (e) {
    console.log(e)
    throw createError({
      message: 'Error uploading file',
      status: 500
    })
  }

  return 'ok'
})