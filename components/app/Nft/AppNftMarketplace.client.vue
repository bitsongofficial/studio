<template>
  <AppConnectBtn v-if="!connected" />
  <v-btn v-if="connected" color="green" rounded="xl" size="large" width="170" @click.stop="$emit('openDialog', 'buy')">
    Buy
  </v-btn>

  <v-btn v-if="connected" color="red" rounded="xl" width="170" size="large" @click.stop="$emit('openDialog', 'sell')">
    Sell
  </v-btn>
</template>

<script setup lang="ts">
const { connected } = useConnect();

const emits = defineEmits<{
  (e: "openDialog", value: "buy" | "sell"): void;
}>();
</script>