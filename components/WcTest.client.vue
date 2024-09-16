<template>
  <div>
    URI: {{ pairingURI }}
  </div>
</template>

<script lang="ts" setup>
import { useWalletConnect } from "@quirks/vue";

const { pairingURI } = useWalletConnect();
</script>