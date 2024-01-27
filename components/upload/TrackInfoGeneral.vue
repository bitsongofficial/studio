<template>
  <v-container class="pa-1">
    <v-row>
      <v-col>
        <v-text-field label="Title" variant="outlined" v-model="modelValue.title"></v-text-field>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col>
        <v-select variant="outlined" :items="languages" label="Title Language" append-inner-icon="mdi-menu-down"
          v-model="modelValue.titleLocale"></v-select>
      </v-col>
      <v-col>
        <v-text-field label="Version (optional)" variant="outlined" v-model="modelValue.version"></v-text-field>
      </v-col>
    </v-row>

    <v-card-title class="px-0">Main Artists</v-card-title>
    <v-row v-for="(artist, index) in modelValue.artists" :key="index" align="center" no-gutters>
      <v-col>
        <v-row>
          <v-col>
            <v-text-field label="Name" variant="outlined" v-model="artist.name"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select variant="outlined" :items="artistRoles" label="Role" append-inner-icon="mdi-menu-down"
              v-model="artist.role"></v-select>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field label="BitSong Address" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" v-if="modelValue.artists.length > 1">
        <v-btn variant="text" color="surface-variant" icon="mdi-delete" @click="removeArtist(index)"></v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="canAddArtist">
      <v-col>
        <v-btn @click="addArtist">Add Artist</v-btn>
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
export interface Artist {
  role: string;
  name: string;
}

export interface TrackInfoGeneral {
  title: string;
  titleLocale?: string;
  version?: string;
  artists: Artist[];
}

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoGeneral];
  "done": [];
}>()

const props = defineProps<{ modelValue: TrackInfoGeneral }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const languages = ref(["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi", "Other"]);

const artistRoles = ref(["Main Artist", "Featured Artist", "Remixer", "Producer", "Composer", "Lyricist", "Arranger", "Orchestra", "Conductor", "DJ", "MC", "Vocalist", "Instrumentalist", "Band", "Group", "Ensemble", "Choir", "Other"]);

const canAddArtist = computed(() => modelValue.value.artists.length === 0 || modelValue.value.artists[modelValue.value.artists.length - 1].role && modelValue.value.artists[modelValue.value.artists.length - 1].name);

function addArtist() {
  modelValue.value.artists.push({
    role: "",
    name: ""
  });
}

function removeArtist(index: number) {
  modelValue.value.artists.splice(index, 1);
}

function onDone() {
  emits("done");
}
</script>
