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

const description = "Lollino, an experienced DJ from Turin, has been a prominent figure in the music industry for nearly two\ndecades. He has graced the decks of top clubs worldwide. Joining him is Deebesh, a DJ and producer from Savona, now based in Turin. Their collaboration gave birth to \"All I Need,\" a cutting-edge tech house track with underground vibes and futuristic sounds. Featuring a heavy bass line, mesmerizing synth, and dynamic drums, this track is primed to ignite dancefloors at clubs and festivals."

const data = reactive({
  id: 'all-i-need',
  title: "All I Need",
  artists: ["Lollino & Deebesh"],
  description,
  creator: "bitsong1rzc9wpzh8sfjlxvarnsh7svvh4myfyd4ej2r5a",
  sellerFeeBps: 500,
  referralFeeBps: 100,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmXXibPrZqtXAqbz1BS8JDVqqMyfkkStGdoRrBkkXZqCrv",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmSvWAqpea6xZT8z2tzZeLCS9hxEfePkGLq2qju7kzL3cp",
  startTime: 1709920800,
  genre: "Electronic",
  explicit: "Clean",
  license: "All Rights Reserved",
  initialPrice: 0.02106,
  marketplaceAddress: "bitsong10l67n20j7cjxu83a6yrdyqqln6mrcq3844c3wccr7qk0vn5j0laq4jvsd4",
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