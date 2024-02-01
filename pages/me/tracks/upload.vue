<template>
  <ClientOnly>
    <UploadTrack @done="onUploadTrackDone" />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'app-bar-only',
  middleware: ["protected"]
})

function onUploadTrackDone(trackId: string) {
  navigateTo(`/me/tracks/${trackId}/edit`)
}
</script>