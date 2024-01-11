<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex pb-2">
          Top Traders
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="4" v-for="n in 3" :key="n">
        <div v-for="i in 4" :key="i + (n - 1) * 4">
          <AppTopTraderItem v-if="traders" :trader="traders[i + (n - 1) * 4 - 1]" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { TopTraderItem } from '~/components/app/AppTopTraderItem.vue';

defineProps<{
  traders?: TopTraderItem[];
}>()
</script>