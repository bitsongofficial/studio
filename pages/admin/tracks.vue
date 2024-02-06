<template>
  <app-page>
    <template #title>
      My Tracks
    </template>
    <template #append>
      <v-btn prepend-icon="mdi-plus" to="/me/tracks/upload">Upload</v-btn>
    </template>
    <template #body>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col>
            {{ data }}
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"]
});

const { $studio } = useNuxtApp();
const { data } = await $studio.admin.tracks.useQuery();
</script>