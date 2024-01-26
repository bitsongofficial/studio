<template>
  <app-page>
    <template #title>
      My Assets
    </template>
    <template #body>
      <v-container fluid class="pt-0">
        <v-row no-gutters>
          <v-col>
            <AppBalances />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"]
});
</script>