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

    <v-row no-gutters>
      <v-col class="text-right">
        <v-btn @click="onDone">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
export interface TrackInfoLyrics {
  lyricsLocale?: string;
  lyrics: string;
}

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoLyrics];
  "done": [];
}>()

const props = defineProps<{ modelValue: TrackInfoLyrics }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const languages = ref(["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi", "Other"]);

function onDone() {
  emits("done");
}
</script>
