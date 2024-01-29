<template>
  <v-container class="pa-1">
    <v-row class="pt-1">
      <v-col>
        <v-textarea auto-grow label="Lyrics (optional)" variant="outlined" v-model="modelValue.lyrics"
          rows="10"></v-textarea>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-select variant="outlined" :items="languages" label="Lyrics Language (optional)"
          append-inner-icon="mdi-menu-down" v-model="modelValue.lyricsLocale"></v-select>
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
const error = ref("");
const loading = ref(false);

export interface TrackInfoLyrics {
  lyricsLocale?: string;
  lyrics: string;
}

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoLyrics];
  "done": [];
}>()

const props = defineProps<{ modelValue: TrackInfoLyrics, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const languages = ref(["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi", "Other"]);

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
        lyrics: modelValue.value.lyrics,
        lyricsLocale: modelValue.value.lyricsLocale
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
