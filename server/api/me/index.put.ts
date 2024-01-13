import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { userUpdateProfileSchema } from '~/server/schema/updateProfile';
import pinataSDK from '@pinata/sdk'
import { Readable } from 'stream';

const prismaClient = new PrismaClient();
const pinata = new pinataSDK(useRuntimeConfig().pinataApiKey, useRuntimeConfig().pinataApiSecret);

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const data = await readMultipartFormData(event)
  if (data === undefined || data.length === 0) {
    throw createError({
      message: 'Username and email are required',
      status: 400
    })
  }

  const avatar = data.find((item) => item.name === 'avatar')
  const cover = data.find((item) => item.name === 'cover')
  const username = data.find((item) => item.name === 'username')?.data.toString().toLowerCase()
  const email = data.find((item) => item.name === 'email')?.data.toString().toLowerCase()

  try {
    await userUpdateProfileSchema.parseAsync({ avatar, cover, username, email })
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

  const usernameResult = await prismaClient.user.findFirst({
    where: {
      username
    }
  })

  if (usernameResult !== null && usernameResult.address !== user.address) {
    throw createError({
      message: 'Username is already taken',
      status: 400
    })
  }

  const emailResult = await prismaClient.user.findFirst({
    where: {
      email
    }
  })

  if (emailResult !== null && emailResult.address !== user.address) {
    throw createError({
      message: 'Email is already taken',
      status: 400
    })
  }

  let attrs: Partial<Lucia.DatabaseUserAttributes> = {
    username,
    email
  }

  if (avatar !== undefined) {
    if (avatar.data.toString() === null || avatar.data.toString() === '') {
      attrs.avatar = null
    } else {
      const avatarStream = new Readable();
      avatarStream.push(avatar.data);
      avatarStream.push(null);

      const pinataRes = await pinata.pinFileToIPFS(avatarStream, { pinataMetadata: { name: `${user.address}_avatar` } })
      attrs.avatar = pinataRes.IpfsHash
    }
  }

  if (cover !== undefined) {
    if (cover.data.toString() === null || cover.data.toString() === '') {
      attrs.cover = null
    } else {
      const coverStream = new Readable();
      coverStream.push(cover.data);
      coverStream.push(null);

      const pinataRes = await pinata.pinFileToIPFS(coverStream, { pinataMetadata: { name: `${user.avatar}_cover` } })
      attrs.cover = pinataRes.IpfsHash
    }
  }

  try {
    const updatedUser = await auth.updateUserAttributes(user.userId, attrs)
    return {
      user: updatedUser
    }
  } catch (error) {
    throw createError({
      message: 'Something went wrong',
      status: 400
    })
  }
})