<template>
  <app-page>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="8" class="text-center">
            <div>
              <video class="mx-auto rounded-xl w-75" controls :poster="data.artworkUrl">
                <source :src="data.previewUrl" type="video/mp4" />
              </video>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12">
                <h1 class="text-md-h4 text-h5">
                  {{ data.title }}
                </h1>
                <h3 class="text-surface-variant">Adam Clay</h3>
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
                  <v-card-title>Airdrop Alert</v-card-title>
                  <v-card-text class="text-surface-variant">
                    If you own one or more pieces from our 'NFT Genesis Collection,' you will receive an exclusive "Ready
                    or Not" by Adam Clay for free!
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="white" block append-icon="mdi-arrow-right"
                      to="/nfts/bitsong1yw4xvtc43me9scqfr2jr2gzvcxd3a9y4eq7gaukreugw2yd2f8ts0wu96q">View NFT</v-btn>
                  </v-card-actions>
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

const description = `**Ready or not** is absolutely the first **Music NFT released by Adam Clay** exclusively for **BitSong**.

The graphic concept is inspired by one of his most iconic photos, immersed in an unknown and vibrant universe, embracing the central concept of the song: diving into that incredible and mysterious journey that is life because only by facing the path will we be able to discover what awaits us along the way. 

As for the musical aspect, the song, composed in collaboration with two well known Italian producers, **Paolo Sandrini** and **Eugenio Ferrara**, is a track with progressive house sounds, that unfolds like a cosmic journey; its energetic beats and ethereal sounds seemingly emanating from another dimension. At its core is a mantra, a lyrical repetition that echoes throughout the song, becoming a rallying cry for the listener.

The words, delivered with warmth by **Adam Clay's voice**, carry a profound message of **hope and liberation**. As the music builds, the mantra gains intensity, reinforcing its transformative power.

The combination of the hypnotic repetition, the dynamic progression of the house beats, and the evocative sounds from beyond infuse the track with a unique energy. It's a musical paradox—dark yet uplifting, grounding yet transcendent, and ultimately a sonic journey that invites the listener to embrace the unknown with open arms.`

const data = reactive({
  title: "Ready or Not",
  artists: ["Adam Clay"],
  description,
  creator: "bitsong1f5ze3svwg8fgjuwwnr743j6fr9vtyr58nex7tu",
  sellerFeeBps: 500,
  referralFeeBps: 100,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmNtpkkNcmi4iE3GaLsoo6K24nGARWRJeXzVKWgVChEJCa",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWF5LpGkH67fqv89cTrB36UAcxo2ZtbY9VSMv7wKKaAoQ",
  startTime: 1706205600,
  genre: "House",
  mood: "Intense",
  explicit: "Clean",
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