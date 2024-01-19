<template>
  <app-page>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8" class="text-center">
            <div>
              <video class="mx-auto rounded-xl w-75" controls :poster="data.artworkUrl">
                <source :src="data.previewUrl" type="audio/wav" />
              </video>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12">
                <h1 class="text-md-h4 text-h5">
                  {{ data.title }}
                </h1>
                <h3 class="text-surface-variant">Goose Pärk</h3>
              </v-col>

              <ClientOnly>
                <v-col cols="12">
                  <v-chip class="mb-2">Start Time</v-chip>

                  <h2 class="text-md-h4 text-h6">
                    <vue-countdown :time="remainingTime" v-slot="{ days, hours, minutes, seconds }">
                      {{ days }}d {{ hours }}h {{ minutes }}m {{ seconds }}s
                    </vue-countdown>
                  </h2>
                </v-col>
              </ClientOnly>

              <v-col cols="12">
                <v-card color="primary" variant="outlined">
                  <v-card-title>Price Alert</v-card-title>
                  <v-card-text class="text-white text-md-h4 text-h6">
                    <v-chip class="mb-2">Initial Price</v-chip>
                    0.02BTSG
                  </v-card-text>
                  <AppDropNotificationBtn class="mt-n1 ma-3" drop-id="stimulation-growth" :title="data.title"
                    :subtitle="data.artists.join(', ')" :image="data.artworkUrl" :start-time="data.startTime" />
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">CREATOR</div>
                <div>
                  <nuxt-link :to="`/u/${data.creator}`" class="text-decoration-none text-white">
                    {{ formatShortAddress(data.creator, 8) }}
                  </nuxt-link>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">SELLER FEE %</div>
                <div>
                  {{ data.sellerFeeBps / 100 }}%
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">REFERRAL FEE %</div>
                <div>
                  {{ data.referralFeeBps / 100 }}%
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">GENRE</div>
                <div>
                  {{ data.genre }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">MOOD</div>
                <div>
                  {{ data.mood }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">EXPLICIT</div>
                <div>
                  {{ data.explicit }}
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="text-caption text-grey text-uppercase">LICENSE</div>
                <div>
                  {{ data.license }}
                </div>
              </v-col>

            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="8" cols="12">
            <div class="md__content" v-html="marked.parse(data.description || '')">
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import VueCountdown from '@chenfengyuan/vue-countdown';
import { marked } from 'marked'

const description = `🚀 Introducing Goose Pärk, your #1 artist hailing from the vibrant city of Miami, FL! 🌴 My journey into the world of music started with a Harlem Globetrotters jersey in high school, leading to the nickname "Goose." After evolving from YabOiGoOse to Goose Park, my producer identity truly took flight during my time in the army stationed in Germany, adding the distinctive two dots over the A, birthing the iconic Goose Pärk.

My musical influences include legends like Outkast, Goodie Mob, Big Krit, Zaytoven, Uncle Luke, and the infectious Miami bass scene. Little did I know, my childhood fascination with recording on a tape recorder would pave the way for my current musical endeavors.

Enter "Stimulation Growth," a beat born out of pure inspiration, which organically transformed into a deep dive into the realms of cryptocurrencies, web3, and decentralization. Originally named "3rd Eye," the song found its true identity as "Stimulation Growth," a track carefully crafted to resonate with the ethos of BitSong.

The stars aligned when I stumbled upon the BitSong NFT contest on their testnet, mirroring the very essence of "Stimulation Growth." The result? A meticulously perfected masterpiece that seamlessly intertwines lyrics, mixing, and mastering, all set to the rhythm of BitSong's groundbreaking platform.

"Stimulation Growth" isn't just a song; it's a groundbreaking musical odyssey that ventures into the heart of the digital realm. It serves as an anthem for the decentralized dreamers, NFT enthusiasts, and blockchain believers. Let the beats of "Stimulation Growth" transport you to a world where technology and creativity unite, pushing the boundaries of what's possible in this new digital era.`

const data = reactive({
  title: "Stimulation Growth",
  artists: ["Goose Pärk"],
  description,
  creator: "bitsong13xknrd2t5d28w3rnkly2dx3yxdwr97vhqr4z5w",
  sellerFeeBps: 500,
  referralFeeBps: 100,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmaiZ12QbbZr6gZdJZAdPXPWWmxqEYN9kueD16b69diyuq",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXecjfvfZB1qs24EU1ra1i7hWUMNd9YDMriKHSAmFD3sg",
  startTime: 1706810400,
  genre: "Rap",
  mood: "Motivational",
  explicit: "Explicit",
  license: "All Rights Reserved",
})

useSeoMeta({
  title: `${data.title} by ${data.artists.join(', ')}`,
  description: data.description,
  ogTitle: data.title,
  twitterTitle: data.title,
  ogImage: data.artworkUrl,
  ogDescription: data.description,
  twitterDescription: data.description,
  twitterCard: "summary_large_image",
})

defineOgImageComponent('DropPreview', {
  title: data.title,
  subtitle: data.artists.join(', '),
  image: data.artworkUrl,
  startTime: data.startTime,
});

const remainingTime = computed(() => {
  return (data.startTime - Math.floor(Date.now() / 1000)) * 1000
})
</script>