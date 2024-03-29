import { ZodError } from "zod"
import { dropNotificationSchema } from "../../../schema/dropNotification"
import { v4 as uuidv4 } from 'uuid';
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
    if (drop_id === null || drop_id === undefined || drop_id === '') {
      throw createError({
        message: 'Drop ID is required',
        status: 400
      })
    }

    const { email } = dropNotificationSchema.parse(await readBody(event))

    const notification = await prisma.dropNotifications.findFirst({
      where: {
        AND: {
          drop_id: drop_id,
          user_id: user.userId
        }
      }
    })

    if (notification !== null) {
      throw createError({
        message: 'You will be notified when this drop is available',
        status: 400
      })
    }

    await prisma.dropNotifications.create({
      data: {
        drop_id: drop_id,
        user_id: user.userId,
        email: email,
        id: uuidv4()
      }
    })

    return {
      message: 'You will be notified when this drop is available'
    }
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