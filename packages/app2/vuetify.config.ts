import { md3 } from "vuetify/blueprints";
import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";

export default defineVuetifyConfiguration({
  directives: true,
  // labComponents: ['VDataTable', 'VDatePickerControls', 'VDatePickerHeader'],
  blueprint: md3,
  icons: {
    defaultSet: "unocss-mdi",
  },
});
