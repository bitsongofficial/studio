<template>
  <v-layout>
    <BNavigationDrawer />
    <BTopBar :show-logo="false" />
    <v-main>
      <slot> </slot>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import favicon_32x32 from '~ui/assets/favicon/favicon-32x32.png'
import favicon_16x16 from '~ui/assets/favicon/favicon-16x16.png'
import favicon_96x96 from '~ui/assets/favicon/favicon-96x96.png'
import apple_icon_57x57 from '~ui/assets/favicon/apple-icon-57x57.png'
import apple_icon_60x60 from '~ui/assets/favicon/apple-icon-60x60.png'
import apple_icon_72x72 from '~ui/assets/favicon/apple-icon-72x72.png'
import apple_icon_76x76 from '~ui/assets/favicon/apple-icon-76x76.png'
import apple_icon_114x114 from '~ui/assets/favicon/apple-icon-114x114.png'
import apple_icon_120x120 from '~ui/assets/favicon/apple-icon-120x120.png'
import apple_icon_144x144 from '~ui/assets/favicon/apple-icon-144x144.png'
import apple_icon_152x152 from '~ui/assets/favicon/apple-icon-152x152.png'
import apple_icon_180x180 from '~ui/assets/favicon/apple-icon-180x180.png'

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      charset: 'utf-8'
    },
    {
      name: 'theme-color',
      content: '#000000'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: '@BitSongOfficial'
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: favicon_32x32
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: favicon_96x96
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: favicon_16x16
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_57x57
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_60x60
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_72x72
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_76x76
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_114x114
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_120x120
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_144x144
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_152x152
    },
    {
      rel: 'apple-touch-icon',
      href: apple_icon_180x180
    },
  ]
})
</script>