<template>
  <v-container>
    <v-row align="center" justify="center" class="d-flex my-12">
      <v-col cols="auto" class="text-h3 font-weight-bold">
        Where do you want to start?
      </v-col>
    </v-row>

    <v-row align="center" justify="center" class="mt-8">
      <v-col cols="5">
        <v-card to="/create/podcast/new" variant="outlined" class="text-center" :style="{ cursor: 'pointer' }">
          <v-container class="py-8">
            <v-row>
              <v-col>
                <v-icon size="96" color="grey-lighten-1">mdi-podcast</v-icon>

                <v-card-title class="text-h5 font-weight-bold">Start a Podcast</v-card-title>
                <v-card-subtitle class="text-body-1">from creation to monetization</v-card-subtitle>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card variant="outlined" class="text-center" :style="{ cursor: 'pointer' }">
          <v-container class="py-8">
            <v-row>
              <v-col>
                <v-icon size="96" color="grey-lighten-1">mdi-rss</v-icon>

                <v-card-title class="text-h5 font-weight-bold">Existing Podcast</v-card-title>
                <v-card-subtitle class="text-body-1">monetize and expand your web3 audience</v-card-subtitle>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'app-bar-only',
})
</script>