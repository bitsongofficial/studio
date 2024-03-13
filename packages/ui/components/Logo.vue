<script lang="ts" setup>
import logoCircle from "~ui/assets/images/logo-circle.svg";
import logoCircleGreen from "~ui/assets/images/logo-circle-green.svg";

const { app: { network } } = useAppConfig();

const logo = computed(() => {
  return network === "mainnet" ? logoCircle : logoCircleGreen;
});
</script>

<template>
  <img :src="logo" height="40">
</template>
