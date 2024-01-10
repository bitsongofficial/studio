<template>
  <v-img v-bind="$attrs" class="mx-md-4 rounded-lg" min-height="450" :max-height="isMobile ? 620 : 450" cover :src="cover"
    :lazy-src="cover">
    <v-container class="fill-height d-flex">
      <v-row align="center" justify="center">
        <v-col cols="auto" class="d-flex">
          <v-container fluid>
            <v-row>
              <v-col cols="12" md="4">
                <v-img :src="image" width="300"></v-img>
              </v-col>
              <v-col cols="12" md="8" class="d-flex align-center">
                <v-card max-width="500" variant="text">
                  <div class="text-h5 px-md-4">{{ title }}</div>
                  <div class="text-body-2 px-md-4 py-3">{{ description }}</div>

                  <v-card-actions style="max-width: 400px">
                    <v-btn size="large" color="primary" rounded="xl" variant="flat" block
                      :to="`/nfts/${contractAddress}`">
                      Mint Now
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";
const { mobile: isMobile } = useDisplay();

defineProps<{
  cover: string;
  image: string;
  title: string;
  description: string;
  contractAddress: string;
}>();
</script>