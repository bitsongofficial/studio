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
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { network, appName } = useRuntimeConfig().public
const { drawer, navItems } = useNavigationDrawer();
</script>
