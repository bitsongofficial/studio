<template>
  <v-app-bar elevation="0" color="black"
    :class="{ 'v-toolbar--player-queue': showQueue && track?.id !== undefined && !mobile }">
    <v-btn class="d-md-none" variant="text" icon="mdi-menu" @click.stop="toggle" />

    <div class="d-flex pt-2 pb-1" :class="{
      'd-md-none': !showLogo,
      'ml-4': showLogo,
    }" :style="{ cursor: 'pointer' }" @click.stop="navigateTo('/')">
      <div><app-logo /></div>
      <div v-if="showAppName" class="ml-3 text-h5 mt-2">{{ appName }}</div>
    </div>

    <template #append v-if="showUserMenu">
      <AppUserMenu />
      <ClientOnly>
        <AppConnectBtn />
      </ClientOnly>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useNavigationDrawer } from "~/composables/useNavigationDrawer";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay()

const { showQueue, track } = usePlayer()

interface Props {
  showLogo?: boolean;
  showAppName?: boolean;
  showUserMenu?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: true,
  showAppName: false,
  showUserMenu: true,
});

const { appName } = useRuntimeConfig().public

const { toggle } = useNavigationDrawer();
</script>
