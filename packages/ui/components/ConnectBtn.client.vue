<template>
  <v-btn v-if="!connected" color="primary" rounded="pill" variant="flat" @click.stop="onClick">
    Connect
  </v-btn>
  <BConnectDialog v-model="dialog" />
</template>

<script setup lang="ts">
const { connected } = useConnect();

const dialog = ref(false);

function onClick() {
  dialog.value = true;
  //umTrackEvent('connect-button');
}
</script>