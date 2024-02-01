import { PrismaClient } from "@prisma/client";

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

    const prismaClient = new PrismaClient();
    await prismaClient.dropNotifications.deleteMany({
      where: {
        AND: {
          drop_id: drop_id,
          user_id: user.userId
        }
      }
    })

    return {
      message: 'You will no longer be notified when this drop is available'
    }
  } catch (e) {
    throw createError({
      message: 'Something went wrong',
      status: 500
    })
  }
})