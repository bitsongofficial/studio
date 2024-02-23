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

const description = `"Sing for Me" weaves a tapestry of romantic sentiments with its dreamy, melodic voice that floats ethereally over a bed of rhythmic instrumentals. As the chorus approaches, there's a palpable sense of anticipation, like the moment before a sunrise. And then, with an exhilarating rush, the powerful EDM drop cascades over the senses, an electrifying blend of synth and bass that pulses through the body. The essence of "Sing for Me" lies in its ability to transport the listener to a space where love is both a quiet whisper and a triumphant shout, all encapsulated within a melody that lingers long after the final note has faded.`

const data = reactive({
  id: 'sing-for-me',
  title: "Sing For Me",
  artists: ["Anirbas"],
  description,
  creator: "bitsong1ruk3eu4zeplywxflg4jh3ggzp76r2dvq5yaudn",
  sellerFeeBps: 500,
  referralFeeBps: 50,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/Qma8B5CGDHzuMebDrrPhYbFRLbkfrERAitBhDwrvfzUsrP",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmZXSzWNcx6WFB4FSsHURzrPge1pyiJEstcH2haFgsgJyX",
  startTime: 1707328800,
  genre: "Dance",
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