<template>
  <div>
    <ClientOnly>
      {{ trackId }}<br>
      {{ form.trackInfo }}

      <v-window v-model="currentStep">
        <v-window-item :value="0">
          <UploadArtwork :track-id="trackId" @done="onUploadArtworkDone" />
        </v-window-item>
        <v-window-item :value="1">
          <UploadVideo :track-id="trackId" @done="onUploadVideoDone" />
        </v-window-item>
        <v-window-item :value="2">
          <UploadTrackInfo :track-id="trackId" v-model="form.trackInfo" @done="currentStep = 4" />
        </v-window-item>
        <v-window-item :value="3">
          <UploadRoyalties v-model="form.royalties" @done="currentStep = 5" />
        </v-window-item>
        <v-window-item :value="4">
          <UploadMarketplace v-model="form.marketplace" @done="currentStep = 0" />
        </v-window-item>
      </v-window>
    </ClientOnly>
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

const trackId = useRoute().params.id as string
const currentStep = ref(0)

const form = reactive({
  trackInfo: {
    id: trackId,
    title: "",
    artwork: "",
    titleLocale: "",
    version: "",
    description: "",
    artists: [{
      name: "",
      role: "",
      address: "",
    }] as Artist[],
    additionalData: {} as TrackInfoAdditionalData,
    authors_publishers: [{
      name: "",
      role: ""
    }] as AuthorPublisher[],
    lyrics: {} as TrackInfoLyrics,
    video: "",
    track: "",
  } as TrackInfo,
  royalties: [{
    role: "",
    shares: 1000,
  }] as RoylatiesItem[],
  marketplace: {},
});

const { data: track, error, refresh } = await useFetch(`/api/me/tracks/${trackId}`, {
  immediate: true
})

watch(track, (newValue) => {
  if (newValue?.artwork) {
    currentStep.value = 1
  }

  form.trackInfo.title = newValue?.title ?? ""
  form.trackInfo.titleLocale = newValue?.titleLocale ?? ""
  form.trackInfo.version = newValue?.version ?? ""
  form.trackInfo.description = newValue?.description ?? ""
  form.trackInfo.artwork = newValue?.artwork ?? ""
  form.trackInfo.additionalData.genre = newValue?.genre ?? ""
  form.trackInfo.additionalData.country = newValue?.country ?? ""
  form.trackInfo.additionalData.license = newValue?.license ?? ""
  form.trackInfo.additionalData.previewStartTime = newValue?.previewStartTime ?? 0
  form.trackInfo.additionalData.previewDuration = newValue?.previewDuration ?? 0
  form.trackInfo.additionalData.explicit = newValue?.explicit === 'Clean' ? false : true
  form.trackInfo.additionalData.liveRecording = newValue?.liveRecording ?? false
  form.trackInfo.additionalData.previousRelease = newValue?.previousRelease ?? false
  form.trackInfo.lyrics.lyrics = newValue?.lyrics ?? ""
  form.trackInfo.lyrics.lyricsLocale = newValue?.lyricsLocale ?? ""
  form.trackInfo.artists = newValue?.artists ? newValue.artists.map((artist) => {
    return {
      name: artist.name,
      role: artist.role,
      address: artist.address,
    }
  }) as Artist[] : [{
    name: "",
    role: "",
    address: "",
  }] as Artist[]
}, {
  immediate: true
})

if (error.value) {
  navigateTo('/me/tracks')
}

async function onUploadArtworkDone() {
  await refresh()
  currentStep.value = 1
}

async function onUploadVideoDone() {
  await refresh()
  currentStep.value = 2
}
</script>