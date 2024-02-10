<template>
  <v-container fluid>
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
          <AppTopTraderItem v-if="data" :trader="data.topTraders[i + (n - 1) * 4 - 1]" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { TopTraderItem } from '~/components/app/AppTopTraderItem.vue';

const { data, error } = await useAsyncData(async () => {
  const topTraders = await $fetch(`/api/top_traders`)

  return {
    topTraders: topTraders.map((trader, index) => ({
      rank: index + 1,
      address: trader.address,
      username: trader.username,
      avatar: trader.avatar,
      volume: trader.volume,
      mints: trader.mints,
      burns: trader.burns,
    } as TopTraderItem)),
  }
})

</script>