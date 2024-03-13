<template>
  <v-container fluid class="v-col-12 pa-0 v-col-md-10">
    <div v-if="slots.title" class="d-flex justify-space-between align-center mt-4 mb-6">
      <v-container fluid>
        <h1 class="text-h4 font-weight-medium">
          <slot name="title"> </slot>
        </h1>

        <p class="text-grey mb-2" v-if="slots.subtitle">
          <slot name="subtitle"></slot>
        </p>
      </v-container>
      <div>
        <slot name="append"> </slot>
      </div>
    </div>
    <div>
      <slot name="body"> </slot>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const slots = useSlots();
</script>
