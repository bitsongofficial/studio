<template>
  <v-navigation-drawer v-model="drawer">
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
          <a v-for="social in socials" :key="social.href" :href="social.href" target="_blank"
            class="text-surface-variant drawer-icon">
            <font-awesome-icon :icon="social.icon"></font-awesome-icon>
          </a>
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
    icon: ['fab', 'discord'],
    href: 'https://discord.bitsong.io',
  },
  {
    icon: ['fab', 'twitter'],
    href: 'https://twitter.com/BitSongOfficial',
  },
  {
    icon: ['fab', 'github'],
    href: 'https://github.com/bitsongofficial/studio'
  },
  {
    icon: ['fab', 'telegram'],
    href: 'https://t.me/BitSongOfficial',
  },
  {
    icon: ['fab', 'instagram'],
    href: 'https://www.instagram.com/bitsong_official'
  },
]
</script>

<style>
.drawer-icon {
  width: 20px;
  height: 20px;
  margin: 15px 10px 25px 10px;
}
</style>
