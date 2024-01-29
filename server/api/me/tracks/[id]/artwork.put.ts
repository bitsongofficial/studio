import { PrismaClient } from '@prisma/client';
import { storeTrackImageToS3 } from '~/server/services/s3';

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)
  const id = getRouterParam(event, 'id')

  const _track = await prisma.tracks.findUnique({
    where: {
      id: id!,
      user_id: user.userId
    }
  })

  if (!_track) {
    throw createError({
      message: 'Track not found',
      status: 404
    })
  }

  const { files } = await readForm(event, {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFieldsSize: 0,
    maxFields: 0,
    maxFiles: 1,
    keepExtensions: true,
  })

  const _file = Array.isArray(files.image) ? files.image[0] : files.image
  if (!_file || _file.originalFilename === null || _file.mimetype === null) {
    throw createError({
      message: 'No file',
      status: 400
    })
  }

  if (!_file.mimetype.startsWith('image/jp')) {
    throw createError({
      message: 'No image file',
      status: 400
    })
  }

  try {
    const fileExtension = _file.originalFilename.split('.').pop()
    const newFilename = `artwork.${fileExtension}`

    const { path } = await storeTrackImageToS3({
      userId: user.userId,
      id: id!,
      filepath: _file.filepath,
      filename: newFilename,
    })

    return await prisma.tracks.update({
      where: {
        id: id!,
        user_id: user.userId
      },
      data: {
        artwork: path
      },
      select: {
        id: true,
      }
    })
  } catch (e) {
    throw createError({
      message: 'Error uploading file',
      status: 500
    })
  }
})