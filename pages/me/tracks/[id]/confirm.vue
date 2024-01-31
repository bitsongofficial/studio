<template>
  <div>
    <v-container class="mt-8">
      <v-row justify="center">
        <v-col cols="auto" class="text-center">
          <h1 class="text-h3 font-weight-bold">Review & Confirm</h1>
          <h2 class="text-h6 pt-2 text-surface-variant">Review the information you have provided and confirm the
            Music NFT</h2>
        </v-col>
      </v-row>

      <v-row justify="center" class="mt-md-12 mt-2">
        <v-col cols="12" md="2">
          <v-card class="d-flex flex-column pa-4">
            <v-img cover gradient="to bottom, rgba(0,0,0,.10), rgba(0,0,0,.7)"
              :src="img(track!.artwork, { width: 250, height: 250, fit: 'cover' })" height="230" width="100%">
            </v-img>
            <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="px-0 mt-2">
              {{ formattedArtists || '-' }}
            </v-card-subtitle>
            <v-card-title class="px-0 mt-n1" :style="{ whiteSpace: 'normal' }">
              {{ track?.title || '-' }} {{ track?.version ? `(${track?.version})` : '' }}
            </v-card-title>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-row no-gutters align="center">
            <v-col>
              <v-btn @click.stop="navigateTo('/me/tracks')">Return to My Tracks</v-btn>
            </v-col>
          </v-row>
          <!--<v-row no-gutters align="center">
            <v-col>
              <v-card-title>Royalties Contract</v-card-title>
              <v-card-subtitle v-if="txRoyalties">TX: {{ txRoyalties }}</v-card-subtitle>
              <v-card-subtitle v-if="royaltiesAddress">Address: {{ royaltiesAddress }}</v-card-subtitle>
            </v-col>
            <v-col class="text-right">
              <v-btn v-if="royaltiesAddress === ''" :loading="txRoyaltiesLoading" :disabled="txRoyaltiesLoading"
                @click.stop="onCreateRoyalties">
                Create
              </v-btn>
            </v-col>
          </v-row>

          <v-row no-gutters align="center" class="pt-6">
            <v-col>
              <v-card-title>Create Music NFT</v-card-title>
            </v-col>
            <v-col class="text-right">
              <v-btn :loading="txCurveLoading" :disabled="txCurveLoading" @click.stop="onCreateCurve">
                Create
              </v-btn>
            </v-col>
          </v-row>-->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { contracts } from "@bitsongjs/telescope";

const { Bs721FactoryClient } = contracts.Bs721Factory;

definePageMeta({
  layout: 'app-bar-only',
  middleware: ["protected"]
})

const trackId = useRoute().params.id as string

const { data: track, refresh } = await useFetch(`/api/me/tracks/${trackId}`, {
  immediate: true
})

const img = useImage();
const formattedArtists = computed(() => track.value?.artists.map(artist => `${artist.name}`).join(", "));

const txRoyalties = ref<any>(null)
const txRoyaltiesLoading = ref(false)

const royaltiesAddress = ref("")

const txCurve = ref<any>(null)
const txCurveLoading = ref(false)

const { success, error } = useNotify()

// async function onCreateRoyalties() {
//   txRoyaltiesLoading.value = true

//   try {
//     const address = getAddress("bitsong");
//     const factoryAddress = "bitsong1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqy04vy2";

//     const factoryClient = new Bs721FactoryClient(
//       await useCWClient(),
//       address,
//       factoryAddress,
//     );

//     const msg = await $fetch(`/api/me/tracks/${trackId}/msgs/royalties`)
//     const tx = await factoryClient.createRoyaltiesGroup(msg, "auto", "", []);

//     success("Transaction success")

//     txRoyalties.value = tx
//     royaltiesAddress.value = tx.logs[0].events[1].attributes[0].value
//   } catch (e) {
//     error((e as Error).message)
//   } finally {
//     txRoyaltiesLoading.value = false
//   }
// }

// async function onCreateCurve() {
//   txCurveLoading.value = true

//   try {
//     const msg = await $fetch(`/api/me/tracks/${trackId}/msgs/curve`)
//     msg.paymentAddress = toValue(royaltiesAddress.value)
//     //msg.paymentAddress = "bitsong1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqy04vy2"

//     const address = getAddress("bitsong");
//     const factoryAddress = "bitsong1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqy04vy2";

//     const factoryClient = new Bs721FactoryClient(
//       await useCWClient(),
//       address,
//       factoryAddress,
//     );

//     const tx = await factoryClient.createCurve(msg, "auto", "", [{ amount: "500000000", denom: "ubtsg" }],);

//     success("Transaction success")

//     // txCurve.value = tx
//   } catch (e) {
//     error((e as Error).message)
//   } finally {
//     txCurveLoading.value = false
//   }
// }
</script>