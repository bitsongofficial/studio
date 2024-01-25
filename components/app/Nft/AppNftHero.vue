<template>
  <v-card v-bind="$attrs" class="app__hero mx-md-4 rounded-xl d-flex align-center" variant="flat">
    <v-row>
      <v-col cols="10" md="8" class="mx-auto">

        <v-row>
          <v-col cols="12" md="4">
            <v-img class="rounded-xl" :src="image" width="300"></v-img>
          </v-col>
          <v-col cols="12" md="8" class="my-auto">
            <v-row>
              <v-col class="text-h5 px-md-4">
                {{ title }}
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="10" class="text-body-2 px-md-4 py-3">
                {{ description }}
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="10">
                <v-btn size="large" color="primary" rounded="xl" variant="flat" block :to="`/nfts/${contractAddress}`">
                  Collect Now
                </v-btn>
              </v-col>
            </v-row>

          </v-col>
        </v-row>

      </v-col>
    </v-row>

  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  cover: string;
  image: string;
  title: string;
  description: string;
  contractAddress: string;
}>();
</script>

<style>
.app__hero {
  height: 450px;

  @media (max-width: 600px) {
    height: 620px;
  }
}
</style>