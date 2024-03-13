<script lang="ts" setup>
import { useNavigationDrawer } from "~ui/composables/useNavigationDrawer";

interface Props {
  showLogo?: boolean;
  showAppName?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: true,
  showAppName: false,
});

const { name } = useAppConfig().app;
const { toggle } = useNavigationDrawer();
</script>

<template>
  <v-app-bar elevation="0" color="black">
    <v-btn class="d-md-none" variant="text" icon @click.stop="toggle">
      <v-icon class="i-mdi:menu" />
    </v-btn>

    <div
      class="d-flex pt-2 pb-1" :class="{
        'd-md-none': !showLogo,
        'ml-4': showLogo,
      }" :style="{ cursor: 'pointer' }" @click.stop="navigateTo('/')"
    >
      <div>
        <BLogo />
      </div>
      <div v-if="showAppName" class="ml-3 text-h5 mt-2">
        {{ name }}
      </div>
    </div>

    <template #append>
      <ClientOnly>
        <BUserMenu />
        <BConnectBtn />
      </ClientOnly>
    </template>
  </v-app-bar>
</template>
