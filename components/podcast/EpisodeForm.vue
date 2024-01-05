<template>
  <v-container class="pa-0">
    <v-row>
      <v-col cols="12">
        <div class="text-subtitle-1 text-medium-emphasis mb-1">Episode Title</div>
        <v-text-field v-model="modelValue.title" variant="outlined" hide-details></v-text-field>
      </v-col>

      <v-col cols="12">
        <div class="text-subtitle-1 text-medium-emphasis mb-1">Episode Description</div>
        <v-textarea v-model="modelValue.description" variant="outlined" auto-grow hide-details></v-textarea>
      </v-col>

      <v-col>
        <div class="text-subtitle-1 text-medium-emphasis mb-1">Explicit Content</div>
        <v-radio-group v-model="modelValue.content">
          <v-radio label="Yes" value="explicit"></v-radio>
          <v-radio label="No" value="clean"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col>
        <div class="text-subtitle-1 text-medium-emphasis mb-1">Episode Type</div>
        <v-radio-group v-model="modelValue.episode_type">
          <v-radio label="Full" value="full"></v-radio>
          <v-radio label="Trailer" value="trailer"></v-radio>
          <v-radio label="Bonus" value="bonus"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
export interface Form {
  title: string | null
  description: string | null
  content: "clean" | "explicit"
  episode_type: "full" | "trailer" | "bonus"
}

interface Props {
  modelValue: Form
}

defineProps<Props>()
</script>