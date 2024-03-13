<template>
  <img :src="logo" height="40" />
</template>

<script lang="ts" setup>
import logoCircle from "~ui/assets/images/logo-circle.svg";
import logoCircleGreen from "~ui/assets/images/logo-circle-green.svg";

const { app: { name, network, githubRepo }, socials } = useAppConfig()

const logo = computed(() => {
  return network === "mainnet" ? logoCircle : logoCircleGreen
});
</script>
