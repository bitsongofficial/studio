<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
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
              <div>
                <v-icon v-if="!imagePreview.value" size="96" color="grey-lighten-1">mdi-podcast</v-icon>
                <v-img v-else :src="imagePreview.value" width="125" height="125" cover>
                </v-img>
              </div>
              <div>
                <v-btn v-if="!imagePreview.value" class="my-6" @click.stop="openFileDialog">Upload Image</v-btn>
                <v-btn v-else color="red" class="my-6" @click.stop="resetFileDialog">Remove</v-btn>
              </div>
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
  </v-container>
</template>

<script lang="ts" setup>
import { categories as rawCategories, languages } from '~/data/podcast'
import { useFileDialog } from '@vueuse/core'

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

const { files, open: openFileDialog, reset: resetFileDialog } = useFileDialog({
  accept: 'image/jpg, image/jpeg, image/png',
  directory: false,
  multiple: false,
})

interface IForm {
  name: string | null
  description: string | null
  author: string | null
  category: string | null
  language: string | null
  content: "clean" | "explicit"
}

const imagePreview = computed(() => useObjectUrl(file))
const file = computed(() => files.value?.length ? files.value[0] : null)
const canSave = computed(() => Object.values(form).some(value => !value))

const form = reactive<IForm>({
  name: null,
  description: null,
  author: null,
  category: null,
  language: null,
  content: 'clean',
})

const { execute: savePodcast, status } = useLazyAsyncData(async () => {
  const formValue = toValue(form)
  const file = toValue(files.value?.[0])
  if (!file) {
    throw createError({
      message: 'No image provided',
      statusCode: 400,
    })
  }

  const formData = new FormData()
  formData.append('image', file, file.name)

  for (const key in formValue) {
    if (key === 'image') continue
    // @ts-ignore
    if (formValue[key]) {
      // @ts-ignore
      formData.append(key, formValue[key])
    }
  }

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
</script>