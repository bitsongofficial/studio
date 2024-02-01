<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h3 font-weight-bold">Track Info</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Enter the track information</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="2">
        <v-card class="d-flex flex-column pa-4">
          <video class="w-100 mb-6" controls :poster="modelValue.artwork">
            <source :src="modelValue.audio" :type="modelValue.audio_mime_type" />
          </video>
          <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="px-0 mt-2">
            {{ formattedArtists || '-' }}
          </v-card-subtitle>
          <v-card-title class="px-0 mt-n1" :style="{ whiteSpace: 'normal' }">
            {{ modelValue.title || '-' }} {{ modelValue.version ? `(${modelValue.version})` : '' }}
          </v-card-title>

          <v-card-title class="px-0 text-surface-variant text-body-1 font-weight-bold" v-if="modelValue.video">
            Video
          </v-card-title>
          <video v-if="modelValue.video" class="w-100" controls>
            <source :src="modelValue.video" :type="modelValue.video_mime_type" />
          </video>

        </v-card>
      </v-col>
      <v-col cols="5">
        <v-window v-model="currentStep">
          <v-window-item :key="0">
            <UploadTrackInfoGeneral :track-id="trackId" v-model="modelValue" @done="onTrackInfoGeneralDone" />
          </v-window-item>
          <v-window-item :key="1">
            <UploadTrackInfoDescription :track-id="trackId" v-model="modelValue.description"
              @done="onTrackInfoDescriptionDone" @back="currentStep = 0" />
          </v-window-item>
          <v-window-item :key="2">
            <UploadTrackInfoAdditionalData :track-id="trackId" v-model="modelValue.additionalData" @done="currentStep = 3"
              @back="currentStep = 1" />
          </v-window-item>
          <v-window-item :key="3">
            <UploadTrackInfoLyrics :track-id="trackId" v-model="modelValue.lyrics" @done="currentStep = 4"
              @back="currentStep = 2" />
          </v-window-item>
          <v-window-item :key="4">
            <UploadTrackInfoAuthors :track-id="trackId" v-model="modelValue.authors_publishers" @done="onDone"
              @back="currentStep = 3" />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { TrackInfoAdditionalData } from './TrackInfoAdditionalData.vue';
import type { AuthorPublisher } from './TrackInfoAuthors.vue';
import type { Artist } from './TrackInfoGeneral.vue';
import type { TrackInfoLyrics } from './TrackInfoLyrics.vue';
import defaultImage from '@/assets/images/default.png';

const img = useImage();

const emits = defineEmits<{
  (e: "done"): void;
}>();

function onDone() {
  emits("done");
}

const currentStep = ref(0)

export interface TrackInfo {
  title: string;
  titleLocale?: string;
  version?: string;
  description?: string;
  artists: Artist[];
  additionalData: TrackInfoAdditionalData;
  authors_publishers: AuthorPublisher[];
  lyrics: TrackInfoLyrics;
  artwork: string;
  audio: string;
  audio_mime_type: string;
  video: string;
  video_mime_type: string;
}

const props = defineProps<{ modelValue: TrackInfo, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const formattedArtists = computed(() => modelValue.value.artists.map(artist => `${artist.name}`).join(", "));

function onTrackInfoGeneralDone() {
  currentStep.value = 1;
}

function onTrackInfoDescriptionDone() {
  currentStep.value = 2;
}
</script>
