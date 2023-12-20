<template>
  <img :src="logo" height="40" />
</template>

<script lang="ts" setup>
const logo = computed(() => {
  if (useRuntimeConfig().public.network === "mainnet") {
    return "/images/logo-circle.svg";
  } else {
    return "/images/logo-circle-green.svg";
  }
});
</script>
