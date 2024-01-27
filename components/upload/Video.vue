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
        <v-card height="300" class="d-flex align-center justify-center flex-column"
          :style="{ border: '1px dashed rgb(139 139 139)' }" @click.stop="onDone">
          <v-icon size="64">mdi-video</v-icon>
          <v-card-title class="text-h5">Click or drag video file</v-card-title>
          <v-card-subtitle :style="{ whiteSpace: 'normal', lineHeight: '1.4rem' }" class="text-center">Only MP4 (stereo,
            320 kbps) are supported</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-6">
      <v-col cols="auto">
        <v-btn color="surface-variant" variant="tonal" size="large" @click.stop="onDone">Continue without video</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  (e: "done"): void;
}>();

function onDone() {
  emits("done");
}
</script>