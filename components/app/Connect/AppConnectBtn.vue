<template>
  <v-btn v-if="!connected" color="primary" rounded="pill" variant="flat" @click.stop="dialog = true">
    Connect
  </v-btn>
  <AppConnectDialog v-model="dialog" />
</template>

<script setup lang="ts">
const { connected } = useConnect();

const dialog = ref(false);
</script>