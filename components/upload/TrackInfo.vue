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
        <v-card class="d-flex flex-column pa-4" @click.stop="onDone">
          <v-img cover gradient="to bottom, rgba(0,0,0,.10), rgba(0,0,0,.7)"
            src="https://bitsong.studio/_vercel/image?url=https://yellow-hilarious-jay-665.mypinata.cloud/ipfs/QmWF5LpGkH67fqv89cTrB36UAcxo2ZtbY9VSMv7wKKaAoQ&w=320&q=100"
            width="100%">
          </v-img>
          <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="px-0 mt-2">
            {{ formattedArtists || '-' }}
          </v-card-subtitle>
          <v-card-title class="px-0 mt-n1" :style="{ whiteSpace: 'normal' }">
            {{ modelValue.title || '-' }} {{ modelValue.version ? `(${modelValue.version})` : '' }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-window v-model="currentStep">
          <v-window-item :key="0">
            <UploadTrackInfoGeneral v-model="modelValue" @done="onTrackInfoGeneralDone" />
          </v-window-item>
          <v-window-item :key="1">
            <UploadTrackInfoDescription v-model="description" @done="onTrackInfoDescriptionDone" />
          </v-window-item>
          <v-window-item :key="2">
            <UploadTrackInfoAdditionalData v-model="modelValue.additionalData" @done="currentStep = 3" />
          </v-window-item>
          <v-window-item :key="3">
            <UploadTrackInfoLyrics v-model="modelValue.lyrics" @done="currentStep = 4" />
          </v-window-item>
          <v-window-item :key="4">
            <UploadTrackInfoAuthors v-model="modelValue.authors_publishers" @done="onDone" />
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
  artists: Artist[];
  additionalData: TrackInfoAdditionalData;
  authors_publishers: AuthorPublisher[];
  lyrics: TrackInfoLyrics;
}

const props = defineProps<{ modelValue: TrackInfo }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const description = ref("");

const formattedArtists = computed(() => modelValue.value.artists.map(artist => `${artist.name}`).join(", "));

function onTrackInfoGeneralDone() {
  currentStep.value = 1;
}

function onTrackInfoDescriptionDone() {
  currentStep.value = 2;
}
</script>
