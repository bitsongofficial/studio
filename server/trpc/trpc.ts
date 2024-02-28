import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { Meta } from './meta'
import { Context } from './context'

const t = initTRPC
  .meta<Meta>()
  .context<Context>()
  .create({
    transformer: superjson,
  })

const authMiddleware = t.middleware(async ({ next, ctx }) => {
  const session = await ctx.authRequest.validate()
  if (!session)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  const user = session?.user ?? null
  if (user === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: { user, role: 'user' }
  })
})

const adminMiddleware = t.middleware(async ({ next, ctx }) => {
  const session = await ctx.authRequest.validate()
  if (!session)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  const user = session?.user ?? null
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const adminAddresses = [
    'bitsong1h882ezq7dyewld6gfv2e06qymvjxnu842586h2', //dev
    'bitsong1q49ntyz2wjurrm56ymm5hjnz60ya3x783c5m6e',
    'bitsong1s5kwp97f2fsysy2rfwv4w5kl06rnta8fj06e2y' //dev2
  ]

  if (adminAddresses.includes(user.address)) {
    ctx.role = 'admin'
  } else {
    ctx.role = 'user'
  }

  if (ctx.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({
    ctx: { user, role: 'admin' }
  })
})

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure

/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure
  .use(authMiddleware)

/**
 * Admin procedure
 */
export const adminProcedure = t.procedure
  .use(adminMiddleware)


export const router = t.router
export const middleware = t.middleware