import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: { '~ui': resolve('./') },
  components: [
    { path: '~ui/components', prefix: 'B' }
  ]
})
