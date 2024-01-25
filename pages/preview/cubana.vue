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
                <h3 class="text-surface-variant">BlackJack Records</h3>
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
                    If you own one or more pieces from our 'NFT Genesis Collection,' you will receive an exclusive
                    "Cubana" by BlackJack Records for free!
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

const description = `The song is a summerish tune with an urban-latin vibe. It’s composed by Tulea BlackJack in BlackJack Records studios.

"Cubana" is a musical journey that seamlessly blends the rich tapestry of Latin beats with the contemporary flair of urban music, resulting in a vibrant and infectious composition. From the first note, the song encapsulates the spirited essence of Havana's dynamic streets, where every corner echoes with the pulsating rhythms of life.

"Cubana" is not just a song; it's a celebration of cultural diversity and the universal language of music. The song's magnetic energy is impossible to resist.

With its toe-tapping beats, soulful melodies, and an undeniable sense of celebration, "Cubana" stands as a testament to the power of music to transcend boundaries and unite people in a shared experience of joy. This track is not just a song; it's an invitation to escape into a world where every note is a step closer to the heart of Havana's pulsating rhythm.`

const data = reactive({
  title: "Cubana",
  artists: ["BlackJack Records"],
  description,
  creator: "bitsong1w35ntzzkf7dugwlq5a6lhrrp2lkq6yamxk42he",
  sellerFeeBps: 750,
  referralFeeBps: 100,
  previewUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmU3cT2KCNRLsFDJa9XTunZhkPFT44hnauxnoBNaYqDsTw",
  artworkUrl: "https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmQZEdsvxqkoUTA9YLzgiHfPJtyh2fTToqhJ1zyzdTc4PT",
  startTime: 1706968800,
  genre: "Urban Latin",
  mood: "Dynamic",
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