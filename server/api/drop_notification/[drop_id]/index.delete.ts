import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    if (!prisma) {
      throw createError({
        message: 'database is not available',
        status: 500
      })
    }

    const user = await ensureAuth(event)
    const drop_id = getRouterParam(event, 'drop_id')
    if (!drop_id) {
      throw createError({
        message: 'Missing drop_id',
        status: 400
      })
    }

    await prisma.dropNotifications.deleteMany({
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