import { defineNuxtModule, addPlugin, createResolver, addServerScanDir } from '@nuxt/kit'
import { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";


declare module 'h3' {
  interface H3EventContext {
    database: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
  }
}
// Module options TypeScript interface definition
export interface ModuleOptions { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'bstudio-db',
    configKey: 'db',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup() {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'))
    addServerScanDir(resolver.resolve('./runtime/server'))
  }
})