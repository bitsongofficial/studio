import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { polyfillNode } from "esbuild-plugin-polyfill-node";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    nftStorageApiKey: '',
    awsS3Region: '',
    awsS3BucketPodcast: '',
    awsS3AccessKeyId: '',
    awsS3SecretAccessKey: '',
    pinataApiKey: '',
    pinataApiSecret: '',
    public: {
      network: process.env.NUXT_PUBLIC_NETWORK || 'testnet',
      rpcAddress: process.env.NUXT_PUBLIC_RPC_ADDRESS || 'https://rpc.bwasmnet-1.bitsong.network',
      restAddress: process.env.NUXT_PUBLIC_REST_ADDRESS || 'https://api.bwasmnet-1.bitsong.network',
      chainId: process.env.NUXT_PUBLIC_CHAIN_ID || 'bwasmnet-1',
      appName: 'Studio',
      links: {
        tos: 'https://bitsong.io/tos',
        privacy: 'https://bitsong.io/privacy'
      },
      ipfsGateway: 'https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/{cid}',
    },
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  build: {
    transpile: ['vue-toastification', 'vuetify'],
  },
  gtag: {
    id: "G-41SQ7H37C8",
  },
  modules: [
    'nuxt-gtag',
    '@nuxt/image',
    '@pinia/nuxt',
    '@quirks/nuxt',
    '@vueuse/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    plugins: [polyfillNode()],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
