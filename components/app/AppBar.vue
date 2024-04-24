<template>
  <v-app-bar elevation="0" color="black">
    <v-btn class="d-md-none" variant="text" icon="mdi-menu" @click.stop="toggle"/>

    <div
class="d-flex pt-2 pb-1" :class="{
      'd-md-none': !showLogo,
      'ml-4': showLogo,
    }" :style="{ cursor: 'pointer' }" @click.stop="navigateTo('/')">
      <div><app-logo/></div>
      <div v-if="showAppName" class="ml-3 text-h5 mt-2">{{ appName }}</div>
    </div>

    <template #append>
      <AppUserMenu />
      <client-only>
        <AppConnectBtn />
      </client-only>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useNavigationDrawer } from "~/composables/useNavigationDrawer";

interface Props {
  showLogo?: boolean;
  showAppName?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: true,
  showAppName: false,
});

const { appName } = useRuntimeConfig().public

const { toggle } = useNavigationDrawer();
</script>
