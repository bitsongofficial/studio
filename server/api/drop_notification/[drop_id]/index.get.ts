import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
export default defineEventHandler(async (event) => {
  try {
    const user = await ensureAuth(event)

    const drop_id = getRouterParam(event, 'drop_id')
    if (!drop_id) {
      throw createError({
        message: 'Missing drop_id',
        status: 400
      })
    }

    const data = await prismaClient.dropNotifications.findFirst({
      where: {
        user_id: user.userId,
        drop_id
      }
    })

    return data
  } catch (e) {
    throw createError({
      message: 'Something went wrong',
      status: 500
    })
  }
})