import { ZodError } from 'zod';
import { ensureAuth } from '~/server/utils/auth';
import { v4 as uuidv4 } from 'uuid';
import { readForm } from '~/server/utils/form';
import { createReadStream } from 'fs'
import { createPodcastEpisode, getPodcastByUserId } from '~/server/models';
import { storePodcastEpisodeToS3 } from '~/server/services/s3';

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const podcast = await getPodcastByUserId(user.userId)
  if (!podcast) {
    throw createError({
      message: 'Podcast not found',
      status: 404
    })
  }

  const { files } = await readForm(event, {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFields: 0,
    maxFiles: 1,
    keepExtensions: true,
  })
  const _file = Array.isArray(files.file) ? files.file[0] : files.file
  if (!_file || _file.originalFilename === null) {
    throw createError({
      message: 'No file',
      status: 400
    })
  }

  if (!_file.mimetype?.startsWith('audio/')) {
    throw createError({
      message: 'No audio file detected',
      status: 400
    })
  }

  try {
    const { contenType: content_type, path: audio_original } = await storePodcastEpisodeToS3({
      userId: user.userId,
      filepath: _file.filepath,
      filename: _file.newFilename,
    })

    const episode = await createPodcastEpisode({
      podcast_id: podcast.id,
      content_type,
      audio_original,
      user_id: user.userId,
    })

    return {
      episode,
    }
  } catch (e) {
    if (e instanceof ZodError) {
      throw createError({
        message: e.issues[0].message,
        status: 400
      })
    }

    console.log(e)

    throw createError({
      message: 'Something went wrong',
      status: 500
    })
  }
})