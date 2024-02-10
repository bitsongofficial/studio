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
          <v-skeleton-loader v-if="pending" class="mr-4 mb-4" type="list-item-avatar-two-line"></v-skeleton-loader>
          <AppTopTraderItem v-else :trader="data?.topTraders[i + (n - 1) * 4 - 1]" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { TopTraderItem } from '~/components/app/AppTopTraderItem.vue';

const { data, pending, execute } = useAsyncData(async () => {
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
}, {
  immediate: false
})

onMounted(() => {
  execute()
})

</script>