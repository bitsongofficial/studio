<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="auto" v-for="track in tracks" :key="track.id">
        <AppMyTracksItem :image="track.artwork || defaultImage" :subtitle="``" :title="track.title || '-'"
          :link="`/me/tracks/${track.id}/edit`" btnText="Complete" />
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts" setup>
import defaultImage from '@/assets/images/default.png'

const { data: tracks, error } = await useFetch(`/api/me/tracks`)
</script>