import { router } from '../trpc'
import { trackAdminRouter } from './track/admin.router'

export const appRouter = router({
  admin: trackAdminRouter
})

// export type definition of API
export type AppRouter = typeof appRouter