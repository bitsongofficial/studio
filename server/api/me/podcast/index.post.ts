import { ZodError } from 'zod';
import { createPodcastSchema } from '~/server/schema/createPodcast';
import { storePodcastImageToS3 } from '~/server/services';
import { ensureAuth } from '~/server/utils/auth';
import { createPodcast, getPodcastByUserId } from '~/server/models';

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)
  const podcast = await getPodcastByUserId(user.userId)
  if (podcast) {
    throw createError({
      message: 'The user already owns a podcast',
      status: 400
    })
  }

  const { fields, files } = await readForm(event, {
    maxFileSize: 8 * 1024 * 1024, // 8MB
    maxFieldsSize: 2 * 1024 * 1024, // 2MB
    maxFields: 6,
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

  const mimeTypeAllowed = ["image/png", "image/jpeg", "image/jpg"]
  if (!mimeTypeAllowed.includes(_file.mimetype)) {
    throw createError({
      message: 'No image file detected',
      status: 400
    })
  }

  try {
    const parsedData = await createPodcastSchema.parseAsync({
      name: Array.isArray(fields.name) ? fields.name[0] : fields.name,
      description: Array.isArray(fields.description) ? fields.description[0] : fields.description,
      author: Array.isArray(fields.author) ? fields.author[0] : fields.author,
      category: Array.isArray(fields.category) ? fields.category[0] : fields.category,
      language: Array.isArray(fields.language) ? fields.language[0] : fields.language,
      content: Array.isArray(fields.content) ? fields.content[0] : fields.content,
    })

    const upload = await storePodcastImageToS3({
      userId: user.userId,
      filename: _file.newFilename,
      filepath: _file.filepath,
    })

    const result = await createPodcast({
      ...parsedData,
      image: upload.path,
      user_id: user.userId
    })

    if (!result) {
      throw createError({
        message: 'Something went wrong',
        status: 500
      })
    }

    return result
  } catch (e) {
    if (e instanceof ZodError) {
      throw createError({
        message: e.issues[0].message,
        status: 400
      })
    }

    throw createError({
      message: 'Something went wrong',
      status: 500
    })
  }
})
