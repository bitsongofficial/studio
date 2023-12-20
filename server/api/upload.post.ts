import { NFTStorage, Blob } from 'nft.storage'

const client = new NFTStorage({ token: useRuntimeConfig().nftStorageApiKey })

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  const user = session?.user ?? null

  if (user === null) {
    throw createError({
      message: 'You must be logged in to upload',
      status: 401
    })
  }

  const files = await readMultipartFormData(event)

  if (files === undefined || files.length === 0) {
    throw createError({
      message: 'No files were uploaded',
      status: 400
    })
  }

  const file = files[0]
  const cid = await client.storeBlob(new Blob([file.data], { type: file.type }))

  return {
    cid
  }
})