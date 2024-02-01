import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { token } = await readBody<{ token: string; }>(event);

  const prismaClient = new PrismaClient();
  const user = await prismaClient.user.findFirst({
    where: {
      AND: {
        email_verified: false,
        email_verification_token: token,
        email_verification_token_expires_at: {
          gte: new Date().toISOString()
        }
      }
    }
  })

  if (user === null) {
    return {
      message: 'Invalid token'
    }
  }

  await prismaClient.user.update({
    where: {
      address: user.address
    },
    data: {
      email: user.email_to_verify,
      email_to_verify: null,
      email_verified: true,
      email_verified_at: new Date().toISOString(),
      email_verification_token: null,
      email_verification_token_expires_at: null
    }
  })

  return {
    message: 'Your email has been verified!'
  }
})