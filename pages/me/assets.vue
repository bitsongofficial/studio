<template>
  <app-page>
    <template #title>
      My Assets
    </template>
    <template #append>
      <v-btn @click.stop="openDialog">Buy / Sell</v-btn>
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
  <AppIbcSwap v-model="dialog" />
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"]
});

const dialog = ref(false);

function openDialog() {
  dialog.value = true;
}
</script>