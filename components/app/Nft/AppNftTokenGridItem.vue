<template>
  <v-card v-bind="$attrs" rounded="lg" style="cursor: pointer">
    <v-img @click.stop="navigateTo(`/nfts/${nft}`)" height="250" cover :src="imageSrc" aspect-ratio="1"></v-img>

    <v-card-subtitle class="mt-4">
      <nuxt-link class="text-decoration-none text-grey text-body-2" :to="`/nfts/${nft}`">
        {{ nftName }}
      </nuxt-link>
    </v-card-subtitle>

    <v-card-title style="min-height: 48px">
      <nuxt-link class="text-decoration-none text-white text-body-1" :to="`/nfts/${nft}`">
        {{ tokenName }}
      </nuxt-link>
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
import defaultImage from "@/assets/images/default.png";

export interface NftTokenGridItem {
  tokenName: string;
  image?: string;
  nftName: string;
  nft: string;
  tokenId: string;
}

const props = defineProps<NftTokenGridItem>();

const img = useImage();

const imageSrc = computed(() => {
  if (!props.image) {
    return defaultImage;
  }

  return img(useIpfsLink(props.image)!, { width: 250, format: 'webp' })
});
</script>
