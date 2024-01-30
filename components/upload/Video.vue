<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h3 font-weight-bold">Upload your video</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Choose the video you want to upload</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="7">
        <v-card :variant="isOverDropZone ? 'teal' : 'flat'" ref="dropZoneRef" :loading="loading" :disabled="loading"
          height="300" class="d-flex align-center justify-center flex-column"
          :style="{ border: '1px dashed rgb(139 139 139)' }" @click.stop="open">
          <v-icon size="64">mdi-video</v-icon>
          <v-card-title class="text-h5">Click or drag video file</v-card-title>
          <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="text-center">Only MP4 (stereo,
            320 kbps) are supported</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-6">
      <v-col cols="auto">
        <v-btn :disabled="loading" color="surface-variant" variant="tonal" size="large" @click.stop="onDone">
          Continue without video
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useFileDialog, useDropZone } from '@vueuse/core'

const emits = defineEmits<{
  (e: "done"): void;
}>();

const loading = ref(false);
const props = defineProps<{ trackId: string }>();

const { open, onChange } = useFileDialog({
  accept: 'video/mp4',
  multiple: false,
})

async function onDrop(files: File[] | null) {
  if (!files) {
    return
  }

  console.log('dropped', files)

  await upload(files[0])

  console.log('done???')
}

const dropZoneRef = ref<HTMLDivElement>()
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['video/mp4']
})

async function upload(file: File) {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('video', file)

    const response = await $fetch(`/api/me/tracks/${props.trackId}/video`, {
      method: 'PUT',
      body: formData,
    })

    console.log(response)

    emits("done");
  } catch (e) {
    console.error((e as Error).message)
  } finally {
    loading.value = false
  }
}

onChange(async (files) => {
  console.log('files', files)
  if (!files) {
    console.log('no files')
    return
  }

  await upload(files[0])
})

function onDone() {
  loading.value = true;
  emits("done");
}

onMounted(() => {
  loading.value = false;
})
</script>