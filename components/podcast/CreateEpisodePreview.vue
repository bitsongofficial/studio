<template>
  <v-card>
    <v-container>
      <v-row no-gutters class="d-flex">
        <v-col cols="auto">
          <v-img v-if="image" cover :src="image" width="120">
          </v-img>
        </v-col>
        <v-col>
          <v-row no-gutters>
            <v-col>
              <v-card-title v-if="title">{{ title }}</v-card-title>
              <v-card-subtitle v-if="author">{{ author }}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <audio v-if="audio" controls :style="{ width: '100%' }" :src="audio">
          </audio>
          <v-btn color="red" class="my-6" @click.stop="$emit('remove')">Remove</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
export interface CreateEpisodePreview {
  title?: string,
  author?: string,
  image?: string,
  audio?: string,
}

const props = withDefaults(defineProps<CreateEpisodePreview>(), {})
const emits = defineEmits<{
  (event: 'remove'): void
}>()
</script>