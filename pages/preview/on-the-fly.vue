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
                    0.018BTSG
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

const description = `“On the Fly” is a track that pulses with the vibrant energy of tribal house, a genre renowned for its potent rhythms and capacity to ignite dance floors. As the beat rolls forward, a series of chopped vocals enter, each snippet carefully sliced and interwoven into the fabric of the instrumental. These vocal cuts are not mere accents; they are integrated as percussive elements, adding layers of rhythm upon the already irresistible core beat. They echo and reverberate, mimicking the call and response of tribal gatherings, and serve to deepen the connection between the music and the primal urge to move. A rhythmic fusion, where every beat, every vocal chop, every rise in tempo is meticulously crafted to ensure that the energy not only remains high but escalates. It's music that doesn't just want you to dance; it compels you, with every fiber of its being, to dance all night long.`

const data = reactive({
  id: 'on-the-fly',
  title: "On The Fly",
  artists: ["Joe Mangione"],
  description,
  creator: "bitsong1qq6xd9qem3f345jlsszuvp5ese0cv2wje5cgyn",
  sellerFeeBps: 500,
  referralFeeBps: 50,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/Qme5hbrEdciQdzoxaZ6mrsPbNcg843zbd7cuqx6cb5HMTe",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmY9Qe1VUTjnvrXNAqeH3YV564STJ3HogWM1EQfe5G1Bn8",
  startTime: 1707933600,
  genre: "House",
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