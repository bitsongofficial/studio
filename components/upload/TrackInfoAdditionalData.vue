<template>
  <v-container class="pa-1">
    <v-row class="pt-1">
      <v-col>
        <v-select variant="outlined" :items="trackGenres" label="Genre" append-inner-icon="mdi-menu-down"
          v-model="modelValue.genre"></v-select>
      </v-col>
      <v-col>
        <v-select variant="outlined" :items="countries" label="Country" append-inner-icon="mdi-menu-down"
          v-model="modelValue.country"></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select variant="outlined" :items="licenses" label="License" append-inner-icon="mdi-menu-down"
          v-model="modelValue.license"></v-select>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Preview Start Time</v-card-title>
        <v-card-subtitle class="px-0">Indicate the start time of the preview of your track.</v-card-subtitle>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="modelValue.previewStartTime" class="mt-2" placeholder="0s" variant="outlined">
          <template #append-inner>sec</template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-n2">
      <v-col cols="8">
        <v-card-title class="px-0">Preview Duration</v-card-title>
        <v-card-subtitle class="px-0">Indicate the duration of the preview of your track.</v-card-subtitle>
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-slider class="mt-5" :min="5" :max="30" :step="0.5" v-model="modelValue.previewDuration"></v-slider>
          </v-col>
          <v-col>
            <div class="mt-6">{{ modelValue.previewDuration > 5 ? modelValue.previewDuration : 5 }} sec</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Explicit</v-card-title>
        <v-card-subtitle class="px-0">If this track contains explicit content</v-card-subtitle>
      </v-col>
      <v-col>
        <v-switch v-model="modelValue.explicit" color="primary"></v-switch>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Live Recording</v-card-title>
        <v-card-subtitle class="px-0">If this is a live recording, please check this box.</v-card-subtitle>
      </v-col>
      <v-col>
        <v-switch v-model="modelValue.liveRecording" color="primary"></v-switch>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Previously Released</v-card-title>
        <v-card-subtitle class="px-0">If this track has been previously released, please check this box.</v-card-subtitle>
      </v-col>
      <v-col>
        <v-switch v-model="modelValue.previousRelease" color="primary"></v-switch>
      </v-col>
    </v-row>

    <v-row v-if="error">
      <v-col>
        <v-alert variant="outlined" type="error">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-right">
        <v-btn :loading="loading" @click="onContinue">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
//import { TrackGenre, Country } from '@bitsongjs/metadata'
import { Country } from '@bitsongjs/metadata'

export interface TrackInfoAdditionalData {
  genre: string;
  country: string;
  license: string;
  explicit: boolean;
  liveRecording: boolean;
  previousRelease: boolean;
  previewStartTime: number;
  previewDuration: number;
}

const error = ref("");
const loading = ref(false);

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoAdditionalData];
  "done": [];
}>()

const props = defineProps<{ modelValue: TrackInfoAdditionalData, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

enum TrackGenre {
  ALTERNATIVE = 'Alternative',
  AMBIENT = 'Ambient',
  BLUES = 'Blues',
  CLASSICAL = 'Classical',
  COUNTRY = 'Country',
  DANCE = 'Dance',
  DRUM_AND_BASS = 'Drum & Bass',
  DUBSTEP = 'Dubstep',
  ELECTRONIC = 'Electronic',
  FOLK = 'Folk',
  FUNK = 'Funk',
  HIP_HOP = 'Hip-Hop',
  HOUSE = 'House',
  INDIE = 'Indie',
  JAZZ = 'Jazz',
  LATIN = 'Latin',
  METAL = 'Metal',
  POP = 'Pop',
  PUNK = 'Punk',
  R_AND_B = 'R&B',
  REGGAE = 'Reggae',
  ROCK = 'Rock',
  SOUL = 'Soul',
  TECHNO = 'Techno',
  TRANCE = 'Trance',
  TRAP = 'Trap',
  WORLD = 'World',
}

const trackGenres = computed(() => Object.values(TrackGenre));

const countries = computed(() => Object.values(Country));

const licenses = [
  "All Rights Reserved",
  "CC BY",
  "CC BY-NC",
  "CC BY-NC-ND",
  "CC BY-NC-SA",
  "CC BY-ND",
  "CC BY-SA",
  "CC0",
  "Public Domain",
  "Other",
];

async function onContinue() {
  error.value = "";
  loading.value = true;

  try {
    await $fetch(`/api/me/tracks/${props.trackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        genre: modelValue.value.genre,
        country: modelValue.value.country,
        license: modelValue.value.license,
        explicit: modelValue.value.explicit,
        liveRecording: modelValue.value.liveRecording,
        previousRelease: modelValue.value.previousRelease,
        previewStartTime: parseInt(modelValue.value.previewStartTime.toString()),
        previewDuration: modelValue.value.previewDuration,
      }
    })

    emits("done");
  } catch (e) {
    error.value = e.data.message;
  } finally {
    loading.value = false;
  }
}
</script>
