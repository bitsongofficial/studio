import { createResolver } from "@nuxt/kit";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: { "~ui": resolve("./") },
  components: [
    { path: "~ui/components", prefix: "B" },
  ],
  build: {
    transpile: ["vuetify"],
  },
  css: [
    "@mdi/font/css/materialdesignicons.css",
    "@fortawesome/fontawesome-free/css/all.css",
  ],
  modules: [
    "@quirks/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error config.plugins is possibly undefined
        config.plugins.push(vuetify({ autoImport: true }));
      });
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
});
