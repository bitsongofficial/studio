<template>
  <app-page>
    <template #body>
      <AppNftHero class="nft-hero"
        :cover="img('https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbGwgtpRFX3XiU2ppFEDnwyCzcfYTNBVsuxcxMMwGpP4t', { width: 1200, format: 'webp' })"
        :image="img('https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbGwgtpRFX3XiU2ppFEDnwyCzcfYTNBVsuxcxMMwGpP4t', { width: 260, format: 'webp' })"
        title="BitSong NFT Genesis Collection Series"
        description="🎵 Dive into the Exclusive Realm of BitSong with Our Genesis NFT Collection! 🌟 This collection is more than digital art – it's your VIP pass to BitSong's vibrant ecosystem"
        contract-address="bitsong1yw4xvtc43me9scqfr2jr2gzvcxd3a9y4eq7gaukreugw2yd2f8ts0wu96q" />

      <AppTopTraders v-if="topTraders" :traders="topTraders" class="my-8" />

      <AppSwiper v-if="data" title="Users" :chip-text="data.total" :items="data.users as SwiperItem[]" class="my-8" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import type { SwiperItem } from '~/components/app/AppSwiper.vue';
import type { TopTraderItem } from '~/components/app/AppTopTraderItem.vue';
import ogImage from "@/assets/images/og-default-1200.png";

const img = useImage();

useSeoMeta({
  title: "BitSong Studio the Home of Web3 Music",
  ogImage,
  description: "BitSong Studio is a decentralized platform that allows music artists and fans to interact with each other in a fair and transparent way.",
})


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
      image: user.avatar ? img(useIpfsLink(user.avatar)!, { width: 160, format: 'webp' }) : undefined,
    })),
  }),
})

const { data: topTraders } = useFetch(`/api/top_traders`, {
  transform: (data) => data.map((trader, index) => ({
    rank: index + 1,
    address: trader.address,
    username: trader.username,
    avatar: trader.avatar,
    volume: trader.volume,
    mints: trader.mints,
    burns: trader.burns,
  } as TopTraderItem)),
})

</script>

<style>
.nft-hero>img.v-img__img {
  filter: brightness(0.4);
}
</style>