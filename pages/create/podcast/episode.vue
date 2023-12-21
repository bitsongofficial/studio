<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Create Episode</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn class="w-50" size="large">Save</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row class="d-flex">
          <v-col cols="4">
            <PodcastCreateEpisodeUpload @upload-complete="onUploadComplete" />
            <PodcastCreateEpisodePreview v-if="preview.audio" :audio="preview.audio" :title="preview.title"
              :image="preview.image" :author="preview.author" />
            <audio controls :style="{ width: '100%' }"
              src="https://bafybeieb6okz7ckvi62ptbr2ng5tnfgfnvbwlhemavj35ykhmp2h2rmr6m.ipfs.dweb.link/">
            </audio>
          </v-col>
          <v-col>
            <v-container class="pa-0">
              <v-row>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis mb-1">Episode Title</div>
                  <v-text-field variant="outlined" hide-details></v-text-field>
                </v-col>

                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis mb-1">Episode Description</div>
                  <v-textarea variant="outlined" auto-grow hide-details></v-textarea>
                </v-col>

                <v-col>
                  <div class="text-subtitle-1 text-medium-emphasis mb-1">Explicit Content</div>
                  <v-radio-group>
                    <v-radio label="Yes" value="one"></v-radio>
                    <v-radio label="No" value="two"></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col>
                  <div class="text-subtitle-1 text-medium-emphasis mb-1">Episode Type</div>
                  <v-radio-group>
                    <v-radio label="Full" value="one"></v-radio>
                    <v-radio label="Trailer" value="two"></v-radio>
                    <v-radio label="Bonus" value="two"></v-radio>
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
import type { CreateEpisodePreview } from '~/components/podcast/CreateEpisodePreview.vue';

definePageMeta({
  layout: 'app-bar-only',
})

const preview = reactive<CreateEpisodePreview>({
  title: undefined,
  audio: undefined,
  author: undefined,
  image: 'https://raw.githubusercontent.com/bitsongofficial/assetlists/main/logos/adam.jpeg',
})

async function onUploadComplete({ id }: { id: string }) {
  console.log(id)

  const data = await $fetch(`/api/me/podcast/7da1a8fa-118a-4fc9-a5cd-56d241f5cb99/episode/${id}/audio-original`)

  if (!data) {
    throw createError({
      message: 'failed to fetch audio url',
      statusCode: 400,
    })
  }

  preview.audio = data.url
}
</script>