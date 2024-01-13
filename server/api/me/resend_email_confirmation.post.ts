import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from 'uuid';

const prismaClient = new PrismaClient()
export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const userResult = await prismaClient.user.findFirst({
    where: {
      AND: {
        email_verified: false,
        address: user.address,
        email_verification_sent_at: {
          lte: new Date(Date.now() - 1 * 60 * 1000).toISOString()
        }
      }
    }
  })

  if (userResult === null || userResult.email_to_verify === null) {
    return {
      message: 'You cannot resend your email confirmation yet. Please wait a few minutes.'
    }
  }

  const email_verification_token = uuidv4()
  const email_verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const email_verification_sent_at = new Date().toISOString()

  await sendEmailVerification(userResult.email_to_verify!, userResult.username!, email_verification_token)

  await prismaClient.user.update({
    where: {
      address: user.address
    },
    data: {
      email_verification_token,
      email_verification_token_expires_at,
      email_verification_sent_at
    }
  })

  return {
    message: 'Email confirmation sent!'
  }
})