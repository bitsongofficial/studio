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

const description = "Luca Testa, the internationally acclaimed DJ and producer from Turin, delivers high-energy hardstyle\ntracks that push boundaries and make a lasting impact on the electronic music scene. His collaboration with Gab3z, “Destructure\", combines powerful beats, aggressive bass lines, and catchy female vocals, infusing hardance influences for an intense and mesmerizing musical experience. Surrender to the infectious rhythms of \"Destructure\" and unleash your energy on the dance floor."

const data = reactive({
  id: 'destructure',
  title: "Destructure (Feat Gab3z)",
  artists: ["Luca Testa"],
  description,
  creator: "bitsong1rzc9wpzh8sfjlxvarnsh7svvh4myfyd4ej2r5a",
  sellerFeeBps: 500,
  referralFeeBps: 100,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmeCPPUvcRKGyps6vCiQSAwFngWXbKTiT9Mgx3M35vLNVp",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmPSq8vYWJ1ALdjBAyju2Gb2yyUoXHwpLwxVoyFrUjVa52",
  startTime: 1709143200,
  genre: "Electronic",
  explicit: "Clean",
  license: "All Rights Reserved",
  initialPrice: 0.02106,
  marketplaceAddress: "bitsong1fur82ejcye82qqeah83v2tndt2m2l3y0ceypdkxe50rl0jj8xxysr0ldqf",
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