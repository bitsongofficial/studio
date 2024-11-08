import { md3 } from 'vuetify/blueprints'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
import colors from 'vuetify/util/colors'

export default defineVuetifyConfiguration({
  directives: true,
  // labComponents: ['VDataTable', 'VDatePickerControls', 'VDatePickerHeader'],
  blueprint: md3,
  // icons: {
  //   defaultSet: "unocss-mdi",
  // },
  theme: {
    defaultTheme: 'mainnetTheme',
    themes: {
      mainnetTheme: {
        dark: true,
        colors: {
          //primary: '#f50059',
          primary: '#f40a63',
          secondary: colors.blue.base,
        },
      },
      testnetTheme: {
        dark: true,
        colors: {
          primary: colors.green.base,
          secondary: colors.blue.base,
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'font-family: "Circular Std"',
    },
  }
})