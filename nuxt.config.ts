// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css' },
      ]
    }
  },

  appConfig: {
    umami: {
      version: 2,
      ignoreLocalhost: true,
    },
  },

  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/scss/style.scss'
  ],

  runtimeConfig: {
    nftStorageApiKey: '',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsSesRegion: '',
    awsS3Region: '',
    awsS3BucketTracks: '',
    awsS3BucketPodcast: '',
    awsS3AccessKeyId: '',
    awsS3SecretAccessKey: '',
    pinataApiKey: '',
    pinataApiSecret: '',
    public: {
      baseUrl: 'http://localhost:3000',
      network: process.env.NUXT_PUBLIC_NETWORK || 'testnet',
      rpcAddress: process.env.NUXT_PUBLIC_RPC_ADDRESS || 'https://rpc.bwasmnet-1.bitsong.network',
      restAddress: process.env.NUXT_PUBLIC_REST_ADDRESS || 'https://api.bwasmnet-1.bitsong.network',
      chainId: process.env.NUXT_PUBLIC_CHAIN_ID || 'bwasmnet-1',
      appName: 'Studio',
      links: {
        tos: 'https://bitsong.io/tos',
        privacy: 'https://bitsong.io/privacy'
      },
      ipfsGateway: 'https://media-api-direct.bitsong.studio/ipfs/{cid}',
      //ipfsGateway: 'http://localhost:3001/media-api/ipfs/{cid}',
      umamiHost: '',
      umamiId: '',
      mediaApi: '',
      mediaApiDirect: '/media-api',
      posthogPublicKey: '',
      posthogHost: '',
      walletconnectProjectId: '',
    },
  },

  build: {
    transpile: ['trpc-nuxt', 'vue-toastification', 'vuetify'],
  },

  gtag: {
    id: "G-41SQ7H37C8",
  },

  image: {
    domains: [
      'yellow-hilarious-jay-665.mypinata.cloud',
      'media-api.bitsong.studio',
      'media-api-direct.bitsong.studio',
      'localhost',
      'bitsong.studio',
      'testnet.bitsong.studio'
    ],
  },

  extends: ['nuxt-umami'],

  modules: [
    '@nuxt/eslint',
    'nuxt-gtag',
    'nuxt-og-image',
    '@nuxt/image',
    '@pinia/nuxt',
    '@quirks/nuxt',
    '@vue-email/nuxt',
    '@vueuse/nuxt',
    'vuetify-nuxt-module',
  ],

  nitro: {
    storage: {
      mnft: {
        driver: 'fs',
        base: './storage/mnft',
      }
    },
    routeRules: {
      '/media-api/**': {
        proxy: {
          to: `${import.meta.env.NUXT_PUBLIC_MEDIA_API || 'http://localhost:3000'}/**`,
        }
      },
      '/ingest/static/**': { proxy: `${import.meta.env.NUXT_PUBLIC_POSTHOG_HOST}/static/**` },
      '/ingest/**': { proxy: `${import.meta.env.NUXT_PUBLIC_POSTHOG_HOST}/**` },
      '/wc-test': {
        ssr: false,
      }
    }
  },

  vueEmail: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  vue: {
    propsDestructure: true,
  },

  vuetify: {
    moduleOptions: {
      disableVuetifyStyles: true,

      styles: {
        configFile: '/assets/scss/settings.scss'
      },

      includeTransformAssetsUrls: {
        NuxtImg: ['src'],
        OgImage: ['image'],
      },

      ssrClientHints: {
        reloadOnFirstRequest: false,
        prefersColorScheme: false,
        // prefersColorSchemeOptions: {
        //   useBrowserThemeOnly: false,
        // },
        viewportSize: true,
      },
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        }
      }
    }
  }

  // vite: {
  //   plugins: [polyfillNode()],
  //   vue: {
  //     template: {
  //       transformAssetUrls,
  //     },
  //   },
  // },
})