<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="8">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Podcast Setup</h1>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn class="w-50" size="large">Save</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <v-row class="d-flex">
          <v-col cols="3">
            <v-sheet class="d-flex align-center justify-center" height="300">
              <v-icon size="96" color="grey-lighten-1">mdi-podcast</v-icon>
            </v-sheet>
          </v-col>
          <v-col>
            <v-container class="pa-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field variant="outlined" label="Podcast Name" hide-details></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea variant="outlined" label="Podcast Description" auto-grow hide-details></v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-text-field variant="outlined" label="Author" hide-details></v-text-field>
                </v-col>

                <v-col cols="7">
                  <h2 class="pb-4">Podcast Details</h2>

                  <v-select variant="outlined" label="Podcast Category"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" hide-details></v-select>

                  <v-select class="mt-5" variant="outlined" label="Podcast Language"
                    :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']" hide-details></v-select>
                </v-col>
                <v-col cols="5">
                  <h2 class="pb-4">Content</h2>
                  <v-radio-group>
                    <v-radio label="Clean" value="one"></v-radio>
                    <v-radio label="Explicit" value="two"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'app-bar-only',
})
</script>