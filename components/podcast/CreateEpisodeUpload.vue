<template>
  <v-sheet v-if="!modelValue?.audio" class="d-flex flex-column align-center justify-center" height="300">
    <div v-if="!file">
      <v-icon size="96" color="grey-lighten-1">mdi-file-upload-outline</v-icon>
    </div>

    <div v-if="errorMessage">
      <v-alert color="red" height="10">{{ errorMessage }}</v-alert>
    </div>

    <v-progress-circular v-if="status === 'pending'" size="64" indeterminate color="purple"></v-progress-circular>

    <div v-if="status !== 'pending'">
      <v-btn v-if="!file" class="my-6" @click.stop="openFileDialog">Upload Episode</v-btn>
      <v-btn v-else color="red" class="my-6" @click.stop="onResetFileDialog">Remove</v-btn>
    </div>
  </v-sheet>
  <PodcastCreateEpisodePreview v-else v-model-value="modelValue" @remove="onResetFileDialog" />
</template>

<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'


interface CreateEpisodePreview {
  title?: string,
  author?: string,
  image?: string,
  audio?: string,
}

interface Props {
  modelValue?: CreateEpisodePreview
}

const props = defineProps<Props>()

const { files, open: openFileDialog, reset: resetFileDialog, onChange } = useFileDialog({
  accept: 'audio/*',
  directory: false,
  multiple: false,
})

const file = computed(() => files.value?.length ? files.value[0] : null)
const errorMessage = ref<string | null>(null)

const emits = defineEmits<{
  (event: 'uploadComplete', value: {
    audio_original: string,
    id: string,
  }): void
}>()

onChange(() => {
  if (file.value) {
    execute()
  }
})

function resetPreview() {
  if (!props.modelValue) return

  props.modelValue.audio = undefined
  props.modelValue.author = undefined
  props.modelValue.title = undefined
  props.modelValue.image = undefined
}

function onResetFileDialog() {
  resetPreview()
  resetFileDialog()
  errorMessage.value = null
}

const { data, execute, status, error } = useLazyAsyncData(async () => {
  errorMessage.value = null

  if (!file.value) {
    throw createError({
      message: 'No image provided',
      statusCode: 400,
    })
  }

  const formData = new FormData()
  formData.append('file', file.value, file.value.name)

  return await $fetch(`/api/me/podcast/episodes`, {
    method: 'POST',
    body: formData,
  })
}, {
  immediate: false,
})

watch(data, (value) => {
  if (value && value.episode) {
    if (!props.modelValue) return

    props.modelValue.audio = useCloudfront(value.episode.audio_original)
    props.modelValue.author = ""
    props.modelValue.title = ""
    props.modelValue.image = "https://raw.githubusercontent.com/bitsongofficial/assetlists/main/logos/adam.jpeg"

    emits('uploadComplete', {
      audio_original: value.episode.audio_original,
      id: value.episode.id,
    })
  }
})

watch(error, (value) => {
  // @ts-ignore
  if (value && value.data) {
    // @ts-ignore
    errorMessage.value = value?.data?.message
  }
})
</script>