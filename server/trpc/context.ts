import type { H3Event } from 'h3'
import type { AppConfig } from 'nuxt/schema'
import type { AuthRequest, User } from 'lucia'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions {
  config: AppConfig
  database: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  auth: Omit<Lucia.Auth, 'handleRequest'>
  authRequest: AuthRequest<Lucia.Auth>
  user?: User
  role: "admin" | "user"
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @link https://trpc.io/docs/v11/context#inner-and-outer-context
 */
export function createContextInner(opts: CreateInnerContextOptions) {
  return opts
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(_event: H3Event) {
  const contextInner = createContextInner({
    config: useAppConfig(),
    database: _event.context.database,
    auth: _event.context.auth,
    authRequest: _event.context.auth.handleRequest(_event),
    role: "user",
  })

  return {
    ...contextInner,
    // Other outer context values as needed
  }
}

//export type Context = inferAsyncReturnType<typeof createContext>
export type Context = Awaited<ReturnType<typeof createContext>>;