import { mdi, aliases } from 'vuetify/iconsets/mdi'
//import { aliases, fa } from 'vuetify/iconsets/fa'
import { fa } from 'vuetify/iconsets/fa-svg'
//import { aliases as aliasesMdi, mdi } from 'vuetify/iconsets/mdi-svg'

export default defineNuxtPlugin((nuxtApp) => {
  const defaultTheme = useRuntimeConfig().public.network === 'mainnet'
    ? 'mainnetTheme'
    : 'testnetTheme'

  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    if (vuetifyOptions.theme && typeof vuetifyOptions.theme !== 'boolean')
      vuetifyOptions.theme.defaultTheme = defaultTheme

    vuetifyOptions.icons = {
      defaultSet: 'mdi',
      aliases,
      sets: {
        fa,
        mdi
      },
    }
  })
  // nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
  // library.add(fas)
  // library.add(far)
  // library.add(fab);
  // config.autoAddCss = false;

  // const defaultTheme = useRuntimeConfig().public.network === 'mainnet'
  //   ? 'mainnetTheme'
  //   : 'testnetTheme'

  // nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
  //   const mainnetTheme: ThemeDefinition = {
  //     dark: true,
  //     colors: {
  //       primary: '#f40a63',
  //       secondary: colors.blue.base,
  //     },
  //   };

  //   const testnetTheme: ThemeDefinition = {
  //     dark: true,
  //     colors: {
  //       primary: colors.green.base,
  //       secondary: colors.blue.base,
  //     },
  //   };
  //   vuetifyOptions.theme = {
  //     defaultTheme,
  //     themes: {
  //       mainnetTheme,
  //       testnetTheme,
  //     },
  //   }
  //   vuetifyOptions.icons = {
  //     defaultSet: 'mdi',
  //     aliases,
  //     sets: {
  //       fa,
  //       mdi
  //     },
  //   }
  // })
});