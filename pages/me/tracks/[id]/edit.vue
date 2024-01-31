<template>
  <div>
    <ClientOnly>
      <v-window v-model="currentStep">
        <v-window-item :value="0">
          <UploadArtwork :track-id="trackId" @done="onUploadArtworkDone" />
        </v-window-item>
        <v-window-item :value="1">
          <UploadVideo :track-id="trackId" @done="onUploadVideoDone" />
        </v-window-item>
        <v-window-item :value="2">
          <UploadTrackInfo :track-id="trackId" v-model="form.trackInfo" @done="currentStep = 3" />
        </v-window-item>
        <v-window-item :value="3">
          <UploadRoyalties :track-id="trackId" v-model="form.royalties" @done="currentStep = 4" />
        </v-window-item>
        <v-window-item :value="4">
          <UploadMarketplace :track-id="trackId" v-model="form.marketplace" @done="currentStep = 5" />
        </v-window-item>
        <v-window-item :value="5">
          <UploadStartTime :track-id="trackId" v-model="form.marketplace.releaseDate" @done="onEditDone" />
        </v-window-item>
      </v-window>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import type { MarketPlace } from '~/components/upload/Marketplace.vue';
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
    audio: "",
    audio_mime_type: "",
    video: "",
    video_mime_type: "",
    titleLocale: "",
    version: "",
    description: "",
    artists: [{
      name: "",
      role: "",
      address: "",
    }] as Artist[],
    authors_publishers: [{
      name: "",
      role: "",
      address: ""
    }] as AuthorPublisher[],
    additionalData: {} as TrackInfoAdditionalData,
    lyrics: {} as TrackInfoLyrics,
  } as TrackInfo,
  royalties: [{
    role: "",
    address: "",
    shares: 1000,
  }] as RoylatiesItem[],
  marketplace: {
    creatorFee: 3,
    referralFee: 0.5,
    ratio: 100,
    releaseDate: 0,
  } as MarketPlace,
});

const { data: track, error, refresh } = await useFetch(`/api/me/tracks/${trackId}`, {
  immediate: true
})

watch(track, (newValue) => {
  if (newValue?.artwork?.endsWith('default.png')) {
    currentStep.value = 0
  } else if (!newValue?.video) {
    currentStep.value = 1
  } else {
    currentStep.value = 2
  }

  form.trackInfo.title = newValue?.title ?? ""
  form.trackInfo.titleLocale = newValue?.titleLocale ?? ""
  form.trackInfo.version = newValue?.version ?? ""
  form.trackInfo.description = newValue?.description ?? ""
  form.trackInfo.artwork = newValue?.artwork ?? ""
  form.trackInfo.audio = newValue?.audio!
  form.trackInfo.audio_mime_type = newValue?.audio_mime_type!

  form.trackInfo.video = newValue?.video! ?? ""
  form.trackInfo.video_mime_type = newValue?.video_mime_type! ?? ""

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


  form.trackInfo.authors_publishers = newValue?.authors_publishers ? newValue.authors_publishers.map((author) => {
    return {
      name: author.name,
      role: author.role,
      address: author.address,
    }
  }) as AuthorPublisher[] : [{
    name: "",
    role: "",
    address: "",
  }] as AuthorPublisher[]

  form.royalties = newValue?.royalties_info ? newValue.royalties_info.map((royalty) => {
    return {
      role: royalty.role,
      address: royalty.address,
      shares: royalty.shares,
    }
  }) as RoylatiesItem[] : [{
    role: "",
    address: "",
    shares: 1000,
  }] as RoylatiesItem[]

  form.marketplace = {
    creatorFee: (newValue?.marketplace && newValue?.marketplace.length > 0) ? newValue.marketplace[0].creator_fee ?? 3 : 3,
    referralFee: (newValue?.marketplace && newValue?.marketplace.length > 0) ? newValue.marketplace[0].referral_fee ?? 0.5 : 0.5,
    curveRatio: (newValue?.marketplace && newValue?.marketplace.length > 0) ? newValue.marketplace[0].ratio ?? 100 : 100,
    releaseDate: newValue?.start_time ?? 0,
  } as MarketPlace

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

async function onEditDone() {
  navigateTo(`/me/tracks/${trackId}/confirm`)
}
</script>