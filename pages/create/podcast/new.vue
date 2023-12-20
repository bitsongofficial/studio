<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="8">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Podcast Setup</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn class="w-50" size="large" :loading="status === 'pending'" @click.stop="savePodcast"
              :disabled="canSave">Save</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row class="d-flex">
          <v-col cols="3">
            <v-sheet class="d-flex flex-column align-center justify-center" height="300">
              <v-icon v-if="!form.image" size="96" color="grey-lighten-1">mdi-podcast</v-icon>
              <v-img v-else :src="form.image" width="125" height="125" contain>
              </v-img>

              <v-btn v-if="!form.image" class="my-6" @click.stop="imageUploader!.click()">Upload Image</v-btn>
              <v-btn v-else color="red" class="my-6" @click.stop="removeImage">Remove</v-btn>
            </v-sheet>
          </v-col>
          <v-col>
            <v-container class="pa-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="form.name" variant="outlined" label="Podcast Name" hide-details></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea v-model="form.description" variant="outlined" label="Podcast Description" auto-grow
                    hide-details></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-text-field v-model="form.author" variant="outlined" label="Author" hide-details></v-text-field>
                </v-col>

                <v-col cols="7">
                  <h2 class="pb-4">Podcast Details</h2>
                  <v-select v-model="form.category" variant="outlined" label="Podcast Category" :items="categories"
                    item-title="name" item-value="value" hide-details></v-select>

                  <v-select v-model="form.language" class="mt-5" variant="outlined" label="Podcast Language"
                    :items="languages" item-title="name" item-value="code" hide-details></v-select>
                </v-col>
                <v-col cols="5">
                  <h2 class="pb-4">Content</h2>
                  <v-radio-group v-model="form.content">
                    <v-radio label="Clean" value="clean"></v-radio>
                    <v-radio label="Explicit" value="explicit"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    {{ form }}
    <input ref="imageUploader" accept="image/*" class="d-none" type="file" @change="imageUpload">
  </v-container>
</template>

<script lang="ts" setup>
import { categories as rawCategories, languages } from '~/data/podcast'

definePageMeta({
  layout: 'app-bar-only',
})

const categories = computed(() => {
  return rawCategories.flatMap(category => [
    {
      name: category.name,
      value: category.name.toLowerCase(),
    },
    ...(category.subcategories?.map(subcategory => ({
      name: `${category.name} > ${subcategory}`,
      value: `${category.name}|${subcategory}`,
    })) ?? [])
  ]);
});

const imageUploader = ref<HTMLInputElement>();

const form = reactive<{
  image: string | null
  name: string | null
  description: string | null
  author: string | null
  category: string | null
  language: string | null
  content: "clean" | "explicit"
}>({
  image: null,
  name: null,
  description: null,
  author: null,
  category: null,
  language: null,
  content: 'clean',
})

function removeImage() {
  form.image = null
}

async function imageUpload() {
  const file = toValue(imageUploader)?.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    if (!e.target) return

    const image = e.target?.result
    if (image) {
      form.image = image.toString()
    }
  }
}

const canSave = computed(() => {
  return Object.values(form).some(value => !value)
})

// TODO: remove this function and convert it in a more simple way
function base64ToFile(base64String: string | null, filename: string): File {
  if (!base64String) {
    throw createError({
      message: 'No image provided',
      statusCode: 400,
    })
  }

  const splitData = base64String.split(',');
  const contentType = splitData[0].split(':')[1].split(';')[0];
  const base64 = splitData[1];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  return new File([blob], filename, { type: contentType });
}

const { execute: savePodcast, status } = useLazyAsyncData(async () => {
  const formValue = toValue(form)

  const formData = new FormData()
  formData.append('image', base64ToFile(formValue.image, 'image'))
  formData.append('name', formValue.name ?? '')
  formData.append('description', formValue.description ?? '')
  formData.append('author', formValue.author ?? '')
  formData.append('category', formValue.category ?? '')
  formData.append('language', formValue.language ?? '')
  formData.append('content', formValue.content)

  try {
    await $fetch('/api/me/podcast', {
      method: 'POST',
      body: formData
    })

    navigateTo('/me/podcast/episodes')
  } catch (e) {
    // @ts-ignore
    throw createError({ message: e.message, statusCode: e.statusCode })
  }
})

// const { execute: savePodcast, status } = useLazyFetch('/api/me/podcast', {
//   method: 'POST',
//   immediate: false,
//   onResponse: (res) => {
//     if (res.response.ok) {
//       navigateTo('/me/podcast/episodes')
//     }
//   },
//   onResponseError: (res) => {
//     throw createError({
//       message: res.response.statusText,
//       statusCode: res.response.status,
//     })
//   },
// })
</script>