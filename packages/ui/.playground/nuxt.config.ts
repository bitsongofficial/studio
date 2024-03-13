export default defineNuxtConfig({
  extends: [".."],
  modules: ["@unocss/nuxt", "vuetify-nuxt-module"],
  vite: {
    optimizeDeps: {
      include: ["@unhead/vue", "@quirks/store"],
    },
  },
  vuetify: {
    moduleOptions: {
      includeTransformAssetsUrls: true,
    },
    vuetifyOptions: "./vuetify.config.ts", // <== you can omit it
  },
});
