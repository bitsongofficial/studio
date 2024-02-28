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
        <v-list-item v-if="(item.onlyAdmin && isAdmin) || !item.onlyAdmin" :exact="item.exact" :to="item.to"
          :prepend-icon="item.icon" rounded="lg">
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
        <div class="d-flex flex-columns justify-center align-center mb-5">
          <a class="v-btn v-theme--mainnetTheme text-surface-variant v-btn--density-default rounded-xl v-btn--size-default v-btn--variant-tonal"
            href="https://github.com/bitsongofficial/studio" target="_blank">
            <span class="v-btn__overlay"></span>
            <span class="v-btn__underlay"></span>
            <v-icon>mdi-github</v-icon>
            <span class="mx-2 text-caption">{{ repo?.stargazers_count }}</span>
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
    icon: ['fab', 'telegram'],
    href: 'https://t.me/BitSongOfficial',
  },
  {
    icon: ['fab', 'instagram'],
    href: 'https://www.instagram.com/bitsong_official'
  },
]

const isAdmin = computed(() => {
  const user = useUserState();
  if (!user.value?.address) return false;

  const admins = [
    "bitsong1h882ezq7dyewld6gfv2e06qymvjxnu842586h2",
    "bitsong1q49ntyz2wjurrm56ymm5hjnz60ya3x783c5m6e",
    "bitsong1f5ze3svwg8fgjuwwnr743j6fr9vtyr58nex7tu"
  ];

  return admins.includes(user.value.address);
})

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
