<template>
  <v-container fluid v-bind="$attrs">
    <v-row>
      <v-col cols="12" v-if="title">
        <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex">
          {{ title }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="{ nft, nftName, tokenId, tokenName, image } in items" :key="`${nft}:${tokenId}`" md="3" cols="12">
        <AppNftTokenGridItem :nft="nft" :nft-name="nftName" :image="image" :token-name="tokenName" :token-id="tokenId" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { NftTokenGridItem } from "./AppNftTokenGridItem.vue";

defineProps<{
  title?: string | null;
  items?: NftTokenGridItem[] | null;
}>();
</script>