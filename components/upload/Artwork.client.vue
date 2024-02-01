<template>
  <v-container class="mt-8">
    <v-row justify="center">
      <v-col cols="auto" class="text-center">
        <h1 class="text-h3 font-weight-bold">Upload your cover</h1>
        <h2 class="text-h6 pt-2 text-surface-variant">Choose the artwork you want to upload</h2>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-12">
      <v-col cols="3">
        <v-card :variant="isOverDropZone ? 'teal' : 'flat'" ref="dropZoneRef" :loading="loading" :disabled="loading"
          height="300" class="d-flex align-center justify-center flex-column"
          :style="{ border: '1px dashed rgb(139 139 139)' }" @click.stop="open">
          <v-icon size="64">mdi-image</v-icon>
          <v-card-title class="text-h5">Click or drag image file</v-card-title>
          <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="text-center px-10">
            Only JPG (square aspect ratio, 72dpi, RGB, min. 3000 x 3000 pixels, max 15000 x 15000 pixels, max size 50mb)
            file are supported
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="4" class="align-center d-flex">
        <div>
          <v-card-title class="text-h5">Track Artwork</v-card-title>
          <v-card-subtitle>
            • File format: JPG<br />
            • Aspect ratio: square<br />
            • minimum: 3,000 x 3,000 pixels<br />
            • maximum: 15,000 x 15,000<br />
            • Color profile: RGB<br />
            • Maximum size: 50 mb<br />
            • Resolution: 72 dpi<br />
          </v-card-subtitle>
        </div>
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
  accept: 'image/jpg, image/jpeg',
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
  dataTypes: ['image/jpg', 'image/jpeg']
})

const { error } = useNotify()

async function upload(file: File) {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('image', file)

    const response = await $fetch(`/api/me/tracks/${props.trackId}/artwork`, {
      method: 'PUT',
      body: formData,
    })

    console.log(response)

    emits("done");
  } catch (e) {
    loading.value = false
    error((e as Error).message)
    console.error((e as Error).message)
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

onMounted(async () => {
  await nextTick()
  loading.value = false
})
</script>