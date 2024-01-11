<template>
  <app-page>
    <template #body>
      <AppProfileHeader v-if="user" :address="user.address" :avatar="user.avatar" :cover="user.cover"
        :username="user.username" />

      <AppNftTokenGrid class="mt-4" :items="nfts" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import type { NftTokenGridItem } from '~/components/app/Nft/AppNftTokenGridItem.vue';
import defaultImage from "~/assets/images/og-default-1200.png";

const address = useRoute().params.address as string

const { data: user, error } = await useFetch(`/api/u/${address}`)
useSeoMeta({
  title: user?.value?.username ? user?.value?.username : address,
  titleTemplate: '%s | Profile | BitSong Studio',
  description: `Check out ${user?.value?.username || address}'s profile on BitSong Studio, the home of Web3 Music.`,
  twitterCard: "summary_large_image",
  ogImage: user?.value?.avatar ? useIpfsLink(user?.value?.avatar) : defaultImage,
});

if (error.value) {
  navigateTo("/")
}

const { data: nfts } = useFetch(`/api/u/${address}/nfts`, {
  transform: (data) => data.map((item) => {
    return {
      nft: item.nft_id,
      nftName: item.nft_name,
      tokenId: item.token_id,
      tokenName: `#${item.token_id}`,
      image: item.nft_image,
    } as NftTokenGridItem
  })
})
</script>