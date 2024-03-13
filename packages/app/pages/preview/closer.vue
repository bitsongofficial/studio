<template>
  <app-page>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8" class="text-center">
            <div>
              <video class="mx-auto rounded-xl w-75" controls playsinline :poster="data.artworkUrl">
                <source :src="data.previewUrl" type="audio/mp3" />
              </video>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12">
                <h1 class="text-md-h4 text-h5">
                  {{ data.title }}
                </h1>
                <h3 class="text-surface-variant">
                  {{ data.artists.join(', ') }}
                </h3>
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
                    {{ data.initialPrice }} BTSG
                  </v-card-text>
                  <AppDropNotificationBtn class="mt-n1 ma-3" :drop-id="data.id" :title="data.title"
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
                <div class="text-caption text-grey text-uppercase">Marketplace</div>
                <div>
                  <nuxt-link target="_blank" :to="`https://www.mintscan.io/bitsong/address/${data.marketplaceAddress}`"
                    class="text-decoration-none text-white">
                    {{ formatShortAddress(data.marketplaceAddress, 8) }}
                  </nuxt-link>
                  <AppCopyBtn class="mt-n3" :text="data.marketplaceAddress" />
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

const description = "My journey of NFTs on BitSong Studio continues, and I couldn't be more thrilled to introduce my latest creation, \"Closer\".\n\n\"Closer\" is a deep house track, filled with melodic vibes and beautiful touches of female vocals. It's all about taking you on a journey, one beat at a time.\n\nWhat makes \"Closer\" so special?\n\n1. 10 lucky Collectors of \"Closer\" will receive an airdrop of my next release. It's my little way of saying thank you for your support\n2. Two Collectors of \"Closer\" (min.20 copies collected) will have a 10% share (5% each) in the royalties set of one of my upcoming releases. Your support means the world to me!\n3. Are you an artist? Let's collaborate! I'm offering the chance to feature your unreleased tune and launch it together as an NFT and on DSPs with my record label, 404 Deep Records.\n4. As if that wasn't enough, one lucky collector (minimum 40 copies collected) will win a physical vinyl of \"Closer\" through a random drawing."

const data = reactive({
  id: 'closer',
  title: "Closer",
  artists: ["Florin Dumbraveanu"],
  description,
  creator: "bitsong1mvqdh3mkc9vaqr5394tkkef08jcnndcernl54j",
  sellerFeeBps: 500,
  referralFeeBps: 50,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmbtPmLQQeSJmWtXiZs3CsqcbqDbEykMLf1ggpnFtt2XK2",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmdbSuJW3a1xWoLgPosaKkKW3ihSGKDWuXVMNQNsyUXr4W",
  startTime: 1710525600,
  genre: "House",
  explicit: "Clean",
  license: "All Rights Reserved",
  initialPrice: 0.0351,
  marketplaceAddress: "bitsong1z2wr8jmxmpe8x3j25rl8360pfl4w9p3ry3dpss90yuek4je4wgxq45hq44",
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