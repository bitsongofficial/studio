<template>
  <v-app-bar elevation="0" color="#121212">
    <v-btn class="d-md-none" @click.stop="toggle" variant="text" icon="mdi-menu"></v-btn>

    <div class="d-flex pt-3 pb-1 d-md-none">
      <div><app-logo> </app-logo></div>
      <div class="ml-3 text-h5 mt-1">Team</div>
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

const { toggle } = useNavigationDrawer();
</script>
