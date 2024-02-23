import { router } from '../trpc'
import { tracksAdminRouter } from './tracks/admin.router'
import { nftsAdminRouter } from './nfts/admin.router'

const adminRouter = router({
  nfts: nftsAdminRouter,
  tracks: tracksAdminRouter
})

export const appRouter = router({
  admin: adminRouter
})

// export type definition of API
export type AppRouter = typeof appRouter