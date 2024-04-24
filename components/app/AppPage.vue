<template>
  <v-container fluid class="v-col-12 pa-0 v-col-md-10">
    <div v-if="slots.title" class="d-flex justify-space-between align-center mt-4 mb-6">
      <v-container fluid>
        <h1 class="text-h4 font-weight-medium">
          <slot name="title"/>
        </h1>

        <p v-if="slots.subtitle" class="text-grey mb-2">
          <slot name="subtitle"/>
        </p>
      </v-container>
      <div>
        <slot name="append"/>
      </div>
    </div>
    <div>
      <slot name="body"/>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const slots = useSlots();
</script>
