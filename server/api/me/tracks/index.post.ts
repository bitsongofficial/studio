import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { storeTrackToS3 } from '~/server/services/s3';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'
import { getMediaData, validateAudioData } from '~/server/utils/media';

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const { files } = await readForm(event, {
    maxFileSize: 300 * 1024 * 1024, // 300MB
    maxFieldsSize: 0,
    maxFields: 0,
    maxFiles: 1,
    keepExtensions: true,
  })

  const _file = Array.isArray(files.audio) ? files.audio[0] : files.audio
  if (!_file || _file.originalFilename === null || _file.mimetype === null) {
    throw createError({
      message: 'No file',
      status: 400
    })
  }

  // if (!_file.mimetype.startsWith('audio/')) {
  //   throw createError({
  //     message: 'No audio file',
  //     status: 400
  //   })
  // }

  try {
    const audio = await getMediaData(_file.filepath)
    const { format_name, duration, size } = audio.format
    validateAudioData(audio)

    const id = uuidv4()
    const newFilename = `audio.${format_name}`

    const { contenType, path } = await storeTrackToS3({
      userId: user.userId,
      id,
      filepath: _file.filepath,
      filename: newFilename,
    })

    const newTrack = await prisma.tracks.create({
      data: {
        id,
        user_id: user.userId,
        audio: path,
        audio_mime_type: contenType,
        format: format_name,
        duration: Math.round(duration! * 1000),
        size: size,
      }
    })

    return {
      id: newTrack.id
    }
  } catch (e) {
    console.log(e)
    throw createError({
      message: 'Error uploading file',
      status: 500
    })
  }
})