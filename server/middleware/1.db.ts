import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

declare module 'h3' {
  interface H3EventContext {
    database: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  }
}

let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export default defineEventHandler((event) => {
  if (prisma) {
    event.context.database = prisma
  } else {
    prisma = new PrismaClient()

    event.context.database = prisma
    // if (process.env.NODE_ENV === 'production') {
    //   prisma = new PrismaClient()
    // } else {
    //   if (!global.prisma) {
    //     global.prisma = new PrismaClient()
    //   }
    //   prisma = global.prisma
    // }
  }
})