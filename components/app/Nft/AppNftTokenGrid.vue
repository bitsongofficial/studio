<template>
  <v-row v-bind="$attrs">
    <v-col v-for="{ nft, nftName, tokenId, tokenName, image } in items" :key="`${nft}:${tokenId}`" md="3" cols="12">
      <AppNftTokenGridItem :nft="nft" :nft-name="nftName" :image="image" :token-name="tokenName" :token-id="tokenId" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import type { NftTokenGridItem } from "./AppNftTokenGridItem.vue";

defineProps<{
  items?: NftTokenGridItem[] | undefined;
}>();
</script>