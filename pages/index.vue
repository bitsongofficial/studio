<template>
  <app-page>
    <template #body>
      <AppNftHero class="nft-hero"
        cover="https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbGwgtpRFX3XiU2ppFEDnwyCzcfYTNBVsuxcxMMwGpP4t"
        image="https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbGwgtpRFX3XiU2ppFEDnwyCzcfYTNBVsuxcxMMwGpP4t"
        title="BitSong NFT Genesis Collection Series"
        description="🎵 Dive into the Exclusive Realm of BitSong with Our Genesis NFT Collection! 🌟 This collection is more than digital art – it's your VIP pass to BitSong's vibrant ecosystem"
        contract-address="bitsong1yw4xvtc43me9scqfr2jr2gzvcxd3a9y4eq7gaukreugw2yd2f8ts0wu96q" />

      <AppSwiper v-if="data" title="Users" :chip-text="data.total" :items="data.users as SwiperItem[]" class="my-8" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import type { SwiperItem } from '~/components/app/AppSwiper.vue';

interface LatestUser {
  address: string;
  username?: string;
  avatar?: string;
}

const { data } = useFetch(`/api/latest/users`, {
  transform: (data) => ({
    total: data.total.toString(),
    users: (data.users as LatestUser[]).map((user) => ({
      variant: "profile",
      title: user.username || formatShortAddress(user.address, 8),
      titleLink: `/u/${user.address}`,
      image: user.avatar ? useIpfsLink(user.avatar) : undefined,
    })),
  }),
})

</script>

<style>
.nft-hero>img.v-img__img {
  filter: brightness(0.4);
}
</style>