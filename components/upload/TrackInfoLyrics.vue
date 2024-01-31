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
          append-inner-icon="mdi-menu-down" v-model="modelValue.lyricsLocale" item-title="text"
          item-value="value"></v-select>
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
        <v-btn @click="onBack" class="mr-4" variant="text" color="surface-variant">Back</v-btn>
        <v-btn :loading="loading" @click="onContinue">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import iso from 'iso-639-1'

const error = ref("");
const loading = ref(false);

export interface TrackInfoLyrics {
  lyricsLocale?: string;
  lyrics: string;
}

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoLyrics];
  "done": [];
  "back": [];
}>()

const props = defineProps<{ modelValue: TrackInfoLyrics, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const languages = iso.getLanguages(iso.getAllCodes())
  .map(lang => {
    return {
      text: lang.name,
      value: lang.code
    }
  })
  .sort((a, b) => a.text.localeCompare(b.text))

function onBack() {
  emits("back");
}

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
