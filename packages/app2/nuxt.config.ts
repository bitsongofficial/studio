// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ["@bstudio/ui"],
  modules: ["@unocss/nuxt", "vuetify-nuxt-module"],
  vite: {
    optimizeDeps: {
      include: ["@unhead/vue", "@quirks/store"],
    },
    build: {
      target: "esnext",
    },
  },
  vue: {
    propsDestructure: true,
  },
  vuetify: {
    moduleOptions: {
      includeTransformAssetsUrls: true,
    },
    vuetifyOptions: "./vuetify.config.ts", // <== you can omit it
  },
});
