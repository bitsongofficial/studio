<template>
  <div>
    <v-window v-model="currentStep">
      <v-window-item :key="0">
        <UploadTrack @done="onUploadTrackDone" />
      </v-window-item>
      <v-window-item :key="1">
        <UploadArtwork @done="onUploadArtworkDone" />
      </v-window-item>
      <v-window-item :key="2">
        <UploadVideo @done="onUploadVideoDone" />
      </v-window-item>
      <v-window-item :key="3">
        <UploadTrackInfo v-model="form.trackInfo" @done="currentStep = 4" />
      </v-window-item>
      <v-window-item :key="4">
        <UploadRoyalties v-model="form.royalties" @done="currentStep = 5" />
      </v-window-item>
      <v-window-item :key="5">
        <UploadMarketplace v-model="form.marketplace" @done="currentStep = 0" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" setup>
import type { RoylatiesItem } from '~/components/upload/Royalties.vue';
import type { TrackInfo } from '~/components/upload/TrackInfo.vue';
import type { TrackInfoAdditionalData } from '~/components/upload/TrackInfoAdditionalData.vue';
import type { AuthorPublisher } from '~/components/upload/TrackInfoAuthors.vue';
import type { Artist } from '~/components/upload/TrackInfoGeneral.vue';
import type { TrackInfoLyrics } from '~/components/upload/TrackInfoLyrics.vue';

definePageMeta({
  layout: 'app-bar-only',
  middleware: ["protected"]
})

const currentStep = ref(0)

const form = reactive({
  trackInfo: {
    title: "",
    titleLocale: "",
    version: "",
    artists: [{
      name: "",
      role: ""
    }] as Artist[],
    additionalData: {} as TrackInfoAdditionalData,
    authors_publishers: [{
      name: "",
      role: ""
    }] as AuthorPublisher[],
    lyrics: {} as TrackInfoLyrics,
    artwork: "",
    video: "",
    track: "",
  } as TrackInfo,
  royalties: [{
    role: "",
    shares: 1000,
  }] as RoylatiesItem[],
  marketplace: {},
});

function onUploadTrackDone() {
  currentStep.value = 1
}

function onUploadArtworkDone() {
  currentStep.value = 2
}

function onUploadVideoDone() {
  currentStep.value = 3
}
</script>