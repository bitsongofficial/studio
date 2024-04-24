import type { Prisma} from '@prisma/client';
import { PrismaClient } from '@prisma/client'
import type { DefaultArgs } from '@prisma/client/runtime/library'

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
}

// eslint-disable-next-line import/no-mutable-exports
let prisma: undefined | PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
