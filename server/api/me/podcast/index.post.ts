import { PrismaClient } from '@prisma/client';
import { NFTStorage } from 'nft.storage';
import { ZodError } from 'zod';
import { createPodcastSchema } from '~/server/schema/createPodcast';
import { ensureAuth } from '~/server/utils/auth';

const client = new NFTStorage({ token: useRuntimeConfig().nftStorageApiKey })
const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)
  const data = await readMultipartFormData(event)
  if (data === undefined || data.length === 0) {
    throw createError({
      message: 'No data',
      status: 400
    })
  }

  const image = data.find((item) => item.name === 'image')
  const name = data.find((item) => item.name === 'name')?.data.toString()
  const description = data.find((item) => item.name === 'description')?.data.toString()
  const author = data.find((item) => item.name === 'author')?.data.toString()
  const category = data.find((item) => item.name === 'category')?.data.toString()
  const language = data.find((item) => item.name === 'language')?.data.toString()
  const content = data.find((item) => item.name === 'content')?.data.toString()

  try {
    const parsedData = await createPodcastSchema.parseAsync({ image, name, description, author, category, language, content })

    // Upload image to NFT Storage
    const imageCid = await client.storeBlob(new Blob([image!.data], { type: image!.type }))

    const result = await prismaClient.podcast.create({
      data: {
        ...parsedData,
        image: imageCid.toString(),
        user_id: user.userId
      },
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