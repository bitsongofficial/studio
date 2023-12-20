import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { md3 } from 'vuetify/blueprints'

import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faGithub,
  faTelegram,
  faDiscord,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";

import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import "@/assets/scss/style.scss";

// @ts-ignore
import colors from "vuetify/lib/util/colors";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
  library.add(faTwitter, faGithub, faTelegram, faDiscord, faMedium, faCoins);
  config.autoAddCss = false;

  const mainnetTheme: ThemeDefinition = {
    dark: true,
    colors: {
      primary: colors.pink.accent2, // dark deep purple
      secondary: colors.blue.base, // blue
    },
  };

  const testnetTheme: ThemeDefinition = {
    dark: true,
    colors: {
      primary: colors.green.base, // dark deep purple
      secondary: colors.blue.base, // blue
    },
  };

  const vuetify = createVuetify({
    components,
    directives,
    blueprint: md3,
    theme: {
      defaultTheme:
        useRuntimeConfig().public.network === "mainnet"
          ? "mainnetTheme"
          : "testnetTheme",
      themes: {
        mainnetTheme,
        testnetTheme,
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
        fa,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
