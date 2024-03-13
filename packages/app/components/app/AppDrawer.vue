<template>
  <v-navigation-drawer v-model="drawer" color="black">
    <div class="d-flex pt-3 pb-1 pl-4">
      <div>
        <NuxtLink to="/">
          <app-logo> </app-logo>
        </NuxtLink>
      </div>
      <div class="ml-3 text-h5 d-flex align-center mr-2">
        <NuxtLink to="/" class="text-decoration-none text-white">
          {{ appName }}
        </NuxtLink>
      </div>
      <div class="d-flex align-center">
        <v-chip color="primary" class="text-capitalize">{{ network }}</v-chip>
      </div>
    </div>
    <v-list nav>
      <div v-for="item in navItems" :key="item.to">
        <v-list-item :exact="item.exact" :to="item.to" :prepend-icon="item.icon" rounded="lg">
          <v-list-item-title class="text-body-1">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </div>
    </v-list>

    <template #append>
      <ClientOnly>
        <div class="d-flex flex-columns justify-center align-center">
          <NuxtLink v-for="social in socials" :key="social.href" :to="social.href" external
            class="text-surface-variant drawer-icon">
            <span :class="social.icon"></span>
          </NuxtLink>
        </div>
        <div class="d-flex flex-columns justify-center align-center mb-5">
          <NuxtLink class="v-btn v-theme--mainnetTheme text-surface-variant v-btn--density-default rounded-xl v-btn--size-default v-btn--variant-tonal"
            to="https://github.com/bitsongofficial/studio" external>
            <span class="v-btn__overlay"></span>
            <span class="v-btn__underlay"></span>
            <v-icon class="i-mdi:github"></v-icon>
            <span class="mx-2 text-caption">{{ repo?.stargazers_count }}</span>
          </NuxtLink>
        </div>
      </ClientOnly>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { network, appName } = useRuntimeConfig().public
const { drawer, navItems } = useNavigationDrawer();

const socials = [
  {
    icon: ['i-logos:discord'],
    href: 'https://discord.bitsong.io',
  },
  {
    icon: ['i-logos:twitter'],
    href: 'https://twitter.com/BitSongOfficial',
  },
  {
    icon: ['i-logos:telegram'],
    href: 'https://t.me/BitSongOfficial',
  },
  {
    icon: ['i-logos:instagram'],
    href: 'https://www.instagram.com/bitsong_official'
  },
]

const { data: repo } = useFetch<{ stargazers_count: number }>('https://api.github.com/repos/bitsongofficial/studio', {
  pick: ['stargazers_count'],
})
</script>

<style>
.drawer-icon {
  width: 20px;
  height: 20px;
  margin: 15px 10px 15px 10px;
}
</style>
