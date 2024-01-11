<template>
  <v-layout>
    <app-drawer> </app-drawer>
    <app-bar :show-logo="false"> </app-bar>
    <v-main>
      <slot> </slot>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
const title = "Bitsong Studio";
const description =
  "Bitsong Studio is a decentralized platform that allows music artists and fans to interact with each other in a fair and transparent way.";

// useSeoMeta({
//   title,
//   description,
//   ogTitle: title,
//   ogDescription: description,
//   ogImage,
//   twitterCard: "summary_large_image",
// });

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
      content: '#121212'
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
      href: '/favicon/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon/favicon-96x96.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon/favicon-16x16.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-57x57.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-60x60.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-72x72.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-76x76.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-114x114.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-120x120.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-144x144.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-152x152.png'
    },
    {
      rel: 'apple-touch-icon',
      href: '/favicon/apple-icon-180x180.png'
    },
  ]
})
</script>