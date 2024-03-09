<template>
  <app-page>
    <template #body>

      <ClientOnly>
        <v-window v-model="window" show-arrows>
          <template v-slot:prev="{ props }">
            <v-btn variant="text" color="white" icon="mdi-chevron-left" @click="props.onClick"></v-btn>
          </template>

          <template v-slot:next="{ props }">
            <v-btn variant="text" color="white" icon="mdi-chevron-right" @click="props.onClick"></v-btn>
          </template>

          <v-window-item v-for="(drop, index) in activeDrops" :key="index" :value="index">
            <v-card class="app__hero mx-md-4 rounded-xl d-flex align-center" variant="text">
              <v-row>
                <v-col cols="10" md="8" class="mx-auto">

                  <v-row>
                    <v-col cols="12" md="4">
                      <NuxtLink :to="`/preview/${drop.id}`" class="text-decoration-none text-white">
                        <NuxtImg class="rounded-xl" :src="drop.image" width="280" height="280" format="webp" />
                      </NuxtLink>
                    </v-col>
                    <v-col cols="12" md="8" class="my-auto">
                      <v-row>
                        <v-col class="text-h5 px-md-4">
                          <NuxtLink :to="`/preview/${drop.id}`" class="text-decoration-none text-white">
                            {{ drop.title }}<br><span class="text-surface-variant text-body-1">{{ drop.subtitle
                              }}</span>
                          </NuxtLink>
                        </v-col>
                      </v-row>


                      <v-row>
                        <v-col cols="12" md="10" class="text-h4 px-md-4 py-3">
                          <ClientOnly>
                            <vue-countdown class="px-md-2" :time="remainingTime(drop.startTime)"
                              v-slot="{ days, hours, minutes, seconds }">
                              {{ days }}d {{ hours }}h {{ minutes }}m {{ seconds }}s
                            </vue-countdown>
                          </ClientOnly>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" md="10" class="pb-0">
                          <v-btn @click.stop="navigateTo(`/preview/${drop.id}`)" block size="large">Preview</v-btn>
                        </v-col>
                        <v-col cols="12" md="10">
                          <AppDropNotificationBtn size="large" class="mt-3" :drop-id="drop.id" :title="drop.title"
                            :subtitle="drop.subtitle"
                            :image="img(drop.image, { width: 230, height: 230, fit: 'cover' })"
                            :start-time="drop.startTime" />
                        </v-col>
                      </v-row>

                    </v-col>
                  </v-row>

                </v-col>
              </v-row>

            </v-card>
          </v-window-item>

          <v-window-item :key="drops.length" :value="drops.length">
            <AppNftHero class="nft-hero mt-8"
              :image="useIpfsLink('ipfs://QmbGwgtpRFX3XiU2ppFEDnwyCzcfYTNBVsuxcxMMwGpP4t')!"
              title="BitSong NFT Genesis Collection"
              description="Dive into the Exclusive Realm of BitSong with Our Genesis NFT Collection! This collection is more than digital art – it's your VIP pass to BitSong's vibrant ecosystem"
              contract-address="bitsong1yw4xvtc43me9scqfr2jr2gzvcxd3a9y4eq7gaukreugw2yd2f8ts0wu96q" />

          </v-window-item>
        </v-window>

      </ClientOnly>


      <AppUpcomingDrops class="my-8" />

      <AppFeaturedDrops class="my-8" />

      <AppTopTraders class="my-8" />

      <AppTopReferrals class="my-8" />

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
import VueCountdown from '@chenfengyuan/vue-countdown';
import type { SwiperItem } from '~/components/app/AppSwiper.vue';
import ogImage from "@/assets/images/og-default-1200.png";

const img = useImage()

const window = ref(0)

interface LatestUser {
  address: string;
  username?: string;
  avatar?: string;
}

const drops = [{
  id: 'glory',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRpEuACERGTLctqQaAjiPfQnj8XrzUkF8o6rmLLhCvSzg",
  subtitle: "Triplo Max",
  title: "GLORY",
  startTime: 1709229600,
  link: "/preview/glory"
}, {
  id: 'uno-dos-tres',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXVXMo3TESkYnXbR8zb1kBeRRtRhYkTDK9T9uFjoTBdjo",
  subtitle: "Torrex",
  title: "Uno Dos Tres",
  startTime: 1709056800,
  link: "/preview/uno-dos-tres"
}, {
  id: 'destructure',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPSq8vYWJ1ALdjBAyju2Gb2yyUoXHwpLwxVoyFrUjVa52",
  subtitle: "Luca Testa",
  title: "Destructure (Feat Gab3z)",
  startTime: 1709143200,
  link: "/preview/destructure"
}, {
  id: 'feel-the-vibe',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmRWZFsYP9m1eQeSooSSk72hBwECLy11U7RvR6mZGuUEKS",
  subtitle: "Dino Brown, Adam Clay",
  title: "Feel The Vibe",
  startTime: 1709316000,
  link: "/preview/feel-the-vibe"
}, {
  id: 'wind-still-blows',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPCoexML73gyABtNfJthK2qMwpLqF5Q5F2scS9jr6qVtS",
  subtitle: "Kiras",
  title: "The Wind Still Blows",
  startTime: 1709661600,
  link: "/preview/wind-still-blows"
}, {
  id: 'all-i-want',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmdKJA6PG55qc3Hbe9Qp8njFjtc8MxMkkU8buvhZUr3shj",
  subtitle: "J Press",
  title: "All I Want",
  startTime: 1709575200,
  link: "/preview/all-i-want"
}, {
  id: 'all-i-need',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmSvWAqpea6xZT8z2tzZeLCS9hxEfePkGLq2qju7kzL3cp",
  subtitle: "Lollino & Deebesh",
  title: "All I Need",
  startTime: 1709920800,
  link: "/preview/all-i-need"
}, {
  id: 'secrets',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmTPzYSevY31hX6Dy6nAXrBz5cBpMjLFRoc1JKk1FzFnDc",
  subtitle: "Noyse, Zangi",
  title: "Secrets (Feat. Eli Limaj)",
  startTime: 1709834400,
  link: "/preview/secrets"
}, {
  id: 'famous-girl',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmZrLNcJVx4s9MNjK2dwW55iXrxnD1KFZ8knbehXJQFzFE",
  subtitle: "J Press",
  title: "Famous Girl",
  startTime: 1710180000,
  link: "/preview/famous-girl"
}, {
  id: 'mexico-bailante',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmNQBCwB6nshni2vpdpC1VNoMnEDjByM3RGxz6UWgL3Brf",
  subtitle: "Torrex",
  title: "Mexico Bailante",
  startTime: 1710266400,
  link: "/preview/mexico-bailante"
}, {
  id: 'casanova',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmUeYQ7cFWdzNoVckpXnNtWBobNUiYieUNGLKtp1VQ9isS",
  subtitle: "Campoli, Adam Clay",
  title: "Casanova",
  startTime: 1710439200,
  link: "/preview/casanova"
}, {
  id: 'anything-i-do',
  image: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmcwP241RSACz8LcZy8ms49TSpgGheq8ejRHPsXRaJZDwP",
  subtitle: "BlackJack, Hamster NFT",
  title: "Anything I Do",
  startTime: 1710352800,
  link: "/preview/anything-i-do"
}]

const activeDrops = computed(() => {
  return drops.filter(drop => drop.startTime > Math.floor(Date.now() / 1000))
    .sort((a, b) => a.startTime - b.startTime)
})

function remainingTime(startTime: number) {
  return (startTime - Math.floor(Date.now() / 1000)) * 1000
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