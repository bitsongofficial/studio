import { createResolver } from "@nuxt/kit";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

const { resolve } = createResolver(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: { "~ui": resolve("./") },
  components: [
    { path: "~ui/components", prefix: "B" },
  ],
  modules: [
    "@quirks/nuxt",
  ],
  vite: {
    plugins: [polyfillNode()],
  },
});
