import { createNuxtApiHandler } from "trpc-nuxt"
import { appRouter } from '~~/server/trpc/x'
import { createContext } from '~~/server/trpc/context'

export default createNuxtApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR')
      console.error('Something bad happened', error)
  },
})