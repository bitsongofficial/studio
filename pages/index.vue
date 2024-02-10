<template>
  <app-page>
    <template #body>
      <AppNftHero class="nft-hero" :image="useIpfsLink('ipfs://QmbGwgtpRFX3XiU2ppFEDnwyCzcfYTNBVsuxcxMMwGpP4t')!"
        title="BitSong NFT Genesis Collection"
        description="Dive into the Exclusive Realm of BitSong with Our Genesis NFT Collection! This collection is more than digital art – it's your VIP pass to BitSong's vibrant ecosystem"
        contract-address="bitsong1yw4xvtc43me9scqfr2jr2gzvcxd3a9y4eq7gaukreugw2yd2f8ts0wu96q" />


      <AppFeaturedDrops class="my-8" />

      <AppUpcomingDrops class="my-8" />

      <AppTopTraders class="my-8" />

      <v-container v-if="pending" fluid class="pb-0">
        <v-row>
          <v-col>
            <v-skeleton-loader class="py-2"
              type="heading, avatar, avatar, avatar, avatar, avatar, avatar, avatar, avatar"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>

      <AppSwiper v-else title="Users" :chip-text="data?.total" :items="users as SwiperItem[]" class="my-8" />
    </template>
  </app-page>
</template>

<script setup lang="ts">
import type { SwiperItem } from '~/components/app/AppSwiper.vue';
import ogImage from "@/assets/images/og-default-1200.png";

interface LatestUser {
  address: string;
  username?: string;
  avatar?: string;
}

const { data, pending, execute } = useAsyncData(async () => {
  const users = await $fetch(`/api/latest/users`)

  return {
    total: users.total.toString(),
    users: users.users as LatestUser[],
  }
}, { immediate: false })

const users = computed(() => {
  return data.value?.users.map((user) => ({
    variant: "profile",
    title: user.username || formatShortAddress(user.address, 8),
    titleLink: `/u/${user.address}`,
    image: user.avatar ? useIpfsLink(user.avatar)! : '/images/default.png'
  }))
})

useSeoMeta({
  title: "BitSong Studio the Home of Web3 Music",
  ogImage,
  description: "BitSong Studio is a decentralized platform that allows music artists and fans to interact with each other in a fair and transparent way.",
})

onMounted(() => {
  execute()
})
</script>

<style>
.nft-hero>img.v-img__img {
  filter: brightness(0.4);
}
</style>