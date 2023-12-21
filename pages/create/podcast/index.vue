<template>
  <v-container>
    <v-row align="center" justify="center" class="d-flex my-12">
      <v-col cols="auto" class="text-h3 font-weight-bold">
        Which best describes you?
      </v-col>
    </v-row>

    <v-row align="center" justify="center" class="mt-8">
      <v-col cols="5">
        <v-card to="/create/podcast/new" variant="outlined" class="text-center" :style="{ cursor: 'pointer' }">
          <v-container class="py-8">
            <v-row>
              <v-col>
                <v-icon size="96" color="grey-lighten-1">mdi-podcast</v-icon>

                <v-card-title class="text-h5 font-weight-bold">I want to start a podcast</v-card-title>
                <v-card-subtitle class="text-body-1">Create, distribute, monetize and more</v-card-subtitle>
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

                <v-card-title class="text-h5 font-weight-bold">I have a podcast</v-card-title>
                <v-card-subtitle class="text-body-1">I want monetize and grow my web3 audience</v-card-subtitle>
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