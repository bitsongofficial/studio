<template>
  <app-page>
    <template #body>
      <AppProfileHeader v-if="user" :address="user.address" :avatar="user.avatar" :cover="user.cover"
        :username="user.username" />

      <AppNftTokenGrid class="mt-4" :items="data" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import type { NftTokenGridItem } from '~/components/app/Nft/AppNftTokenGridItem.vue';
import defaultImage from "~/assets/images/og-default-1200.png";

definePageMeta({
  middleware: ["protected"]
});

const user = useUserState()
useSeoMeta({
  title: user.value?.username ? user.value?.username : user.value?.address,
  titleTemplate: '%s | Profile | BitSong Studio',
  description: `Check out ${user?.value?.username || user.value?.address}'s profile on BitSong Studio, the home of Web3 Music.`,
  twitterCard: "summary_large_image",
  ogImage: user?.value?.avatar ? useIpfsLink(user?.value?.avatar) : defaultImage,
});

const { data, error } = useFetch(`/api/u/${user.value?.address}/nfts`, {
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

if (error.value) {
  navigateTo("/")
}
</script>