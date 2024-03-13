<template>
  <app-page>
    <template #body>
      <AppProfileHeader :address="address" :avatar="user?.avatar" :cover="user?.cover" :username="user?.username"
        :email="user?.email" />

      <!--<AppUpcomingDrops v-if="address === 'bitsong1f5ze3svwg8fgjuwwnr743j6fr9vtyr58nex7tu'" class="my-8" />-->

      <AppNftTokenGrid class="my-8" title="Collected" :items="nfts" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import type { NftTokenGridItem } from '~/components/app/Nft/AppNftTokenGridItem.vue';
import defaultImage from "~/assets/images/og-default-1200.png";
import { isValidAddress } from '@bitsongjs/metadata'

const address = computed(() => useRoute().params.address as string)

watch(address, (value) => {
  if (!isValidAddress(value, "bitsong")) {
    navigateTo("/")
  }
})

const { data: user } = await useFetch(`/api/u/${address.value}`)
const title = computed(() => user?.value?.username ?? address.value)

useSeoMeta({
  title: title.value,
  titleTemplate: '%s | Profile | BitSong Studio',
  description: `Check out ${title.value}'s profile on BitSong Studio, the home of Web3 Music.`,
  twitterCard: "summary_large_image",
  ogImage: user?.value?.avatar ? useIpfsLink(user?.value?.avatar) : defaultImage,
});

// if (error.value) {
//   navigateTo("/")
// }

const { data: nfts } = useFetch(`/api/u/${address.value}/nfts`, {
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