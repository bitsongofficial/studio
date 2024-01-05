<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Edit Episode: {{ episode_id }}</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn class="w-50" size="large" :loading="status === 'pending'" @click.stop="saveEpisode">Save</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row class="d-flex">
          <v-col cols="4">
            <PodcastCreateEpisodeUpload v-model="preview" @upload-complete="onUploadComplete" />
          </v-col>
          <v-col>
            <PodcastEpisodeForm v-model="form" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { CreateEpisodePreview } from '~/components/podcast/CreateEpisodePreview.vue';

const { params } = useRoute();
const { episode_id } = params;

definePageMeta({
  layout: 'app-bar-only',
})

const preview = ref<CreateEpisodePreview>()

const { form, onUploadComplete, saveEpisode, status } = await useCreatePodcastEpisode()

await useAsyncData(`me:podcast:episode:${episode_id}`, async () => {
  const { episode } = await $fetch(`/api/me/podcast/episodes/${episode_id}`)
  if (!episode) navigateTo('/me/podcast/episodes')

  form.title = episode.title
  form.description = episode.description
  form.content = (episode.explicit as "explicit" | "clean")
  form.episode_type = (episode.episode_type as "full" | "trailer" | "bonus")

  return episode
})
</script>
