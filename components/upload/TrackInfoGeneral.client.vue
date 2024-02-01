<template>
  <v-container class="pa-1">
    <v-row>
      <v-col>
        <v-text-field label="Title" variant="outlined" v-model="modelValue.title"></v-text-field>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col>
        <v-select variant="outlined" :items="languages" item-title="text" item-value="value" label="Title Language"
          append-inner-icon="mdi-menu-down" v-model="modelValue.titleLocale"></v-select>
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
            <v-select variant="outlined" :items="artistRoles" item-title="text" item-value="value" label="Role"
              append-inner-icon="mdi-menu-down" v-model="artist.role"></v-select>
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
import iso from 'iso-639-1'

import { z } from 'zod'
import { bitsongAddressSchema, nonEmptyStringSchema, LocaleSchema } from '@bitsongjs/metadata';

const artistRoles = [{
  text: "Main Artist",
  value: "Main Artist"
}, {
  text: "Featuring",
  value: "Featuring"
}, {
  text: "Remixed By",
  value: "Remixed By"
}, {
  text: "Versus (vs)",
  value: "Versus (vs)"
}, {
  text: "With",
  value: "With"
}]

const FormSchema = z.object({
  title: nonEmptyStringSchema('The title of the track.'),
  titleLocale: LocaleSchema,
  version: z.string({ description: 'The version of the track.' }).optional(),
  artists: z.array(
    z.object({
      name: nonEmptyStringSchema('The name of the artist.'),
      role: z.string().min(1, {
        message: 'You must select an artist role.'
      }).refine((role) => {
        return artistRoles.map(r => r.value).includes(role)
      }, {
        message: 'You must select a valid artist role.'
      }),
      address: bitsongAddressSchema(),
    })
  ).nonempty(
    { message: 'At least one artist is required.' }
  ),
})

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

const languages = iso.getLanguages(iso.getAllCodes())
  .map(lang => {
    return {
      text: lang.name,
      value: lang.code
    }
  })
  .sort((a, b) => a.text.localeCompare(b.text))

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
    const data = FormSchema.safeParse(modelValue.value);
    if (!data.success) {
      error.value = data.error.errors[0].message;
      return
    }

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
    if (e instanceof z.ZodError) {
      error.value = e.message
    } else {
      error.value = e.data.message;
    }
  } finally {
    loading.value = false;
  }
}
</script>
