<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="8">
        <v-row class="d-flex justify-space-between">
          <v-col cols="auto">
            <h1>Create Episode</h1>
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
                  <v-text-field variant="outlined" label="Episode Title" hide-details></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea variant="outlined" label="Episode Description" auto-grow hide-details></v-textarea>
                </v-col>

                <v-col>
                  <h4 class="pb-4">Publish date</h4>
                  <v-radio-group>
                    <v-radio label="Now" value="one"></v-radio>
                    <v-radio label="Schedule" disabled value="two"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col>
                  <h4 class="pb-2">Explicit Content</h4>
                  <v-radio-group>
                    <v-radio label="Yes" value="one"></v-radio>
                    <v-radio label="No" value="two"></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col>
                  <h4 class="pb-2">Episode Type</h4>
                  <v-radio-group>
                    <v-radio label="Full" value="one"></v-radio>
                    <v-radio label="Trailer" value="two"></v-radio>
                    <v-radio label="Bonus" value="two"></v-radio>
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