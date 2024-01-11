<template>
  <v-app-bar elevation="0" color="black">
    <v-btn class="d-md-none" @click.stop="toggle" variant="text" icon="mdi-menu"></v-btn>

    <div class="d-flex pt-2 pb-1" :class="{
      'd-md-none': !showLogo,
      'ml-4': showLogo,
    }" :style="{ cursor: 'pointer' }" @click.stop="navigateTo('/')">
      <div><app-logo> </app-logo></div>
      <div class="ml-3 text-h5 mt-2" v-if="showAppName">{{ appName }}</div>
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

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
  showAppName: false,
});

const { appName } = useRuntimeConfig().public

const { toggle } = useNavigationDrawer();
</script>
