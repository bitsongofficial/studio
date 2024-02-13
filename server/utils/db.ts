import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

declare global {
  var prisma: undefined | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

let prisma: undefined | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      }
    })
  }
  prisma = global.prisma
}

export default prisma