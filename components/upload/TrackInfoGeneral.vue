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
            <v-text-field label="BitSong Address" v-model="artist.address" variant="outlined"></v-text-field>
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
export interface Artist {
  role: string;
  name: string;
  address: string;
}

export interface TrackInfoGeneral {
  title: string;
  titleLocale?: string;
  version?: string;
  artists: Artist[];
}

const error = ref("");
const loading = ref(false);

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoGeneral];
  "done": [];
}>()

const props = defineProps<{ modelValue: TrackInfoGeneral, trackId: string }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

const languages = ref(["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Hindi", "Other"]);

const artistRoles = ref([
  "Main Artist",
  "Featuring",
  "Remixed By",
  "Versus (vs)",
  "With"
]);

const canAddArtist = computed(() => modelValue.value.artists.length === 0 || modelValue.value.artists[modelValue.value.artists.length - 1].role && modelValue.value.artists[modelValue.value.artists.length - 1].name);

function addArtist() {
  modelValue.value.artists.push({
    role: "",
    name: "",
    address: ""
  });
}

function removeArtist(index: number) {
  modelValue.value.artists.splice(index, 1);
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
        title: modelValue.value.title,
        titleLocale: modelValue.value.titleLocale,
        version: modelValue.value.version,
        artists: modelValue.value.artists.filter(artist => artist.name && artist.role && artist.address)
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
