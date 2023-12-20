<template>
  <v-app-bar elevation="0" color="#121212">
    <v-btn class="d-md-none" @click.stop="toggle" variant="text" icon="mdi-menu"></v-btn>

    <div class="d-flex pt-2 pb-1" :class="{
      'd-md-none': !showLogo,
      'ml-4': showLogo,
    }">
      <div><app-logo> </app-logo></div>
      <div class="ml-3 text-h5 mt-2">{{ appName }}</div>
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
}

const props = withDefaults(defineProps<Props>(), {
  showLogo: true,
});

const { appName } = useRuntimeConfig().public

const { toggle } = useNavigationDrawer();
</script>
