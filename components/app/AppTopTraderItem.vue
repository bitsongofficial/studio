<template>
  <v-card class="pa-1 pa-md-3 px-4" variant="text" :to="`/u/${trader.address}`">
    <v-row class="align-center">
      <v-col cols="auto" class="text-h6" style="min-width: 46px;">
        {{ trader.rank }}
      </v-col>
      <v-col cols="auto">
        <NuxtLink>
          <v-avatar size="42">
            <NuxtImg :src="trader.avatar ? useIpfsLink(trader.avatar) : '/images/default.png'" width="42" height="42"
              :alt="trader.username || trader.address" format="webp" />
          </v-avatar>
        </NuxtLink>
      </v-col>
      <v-col>
        <div class="text-subtitle-1">{{ trader.username ? trader.username : formatShortAddress(trader.address, 8) }}</div>
        <div class="text-subtitle-2 text-surface-variant font-weight-thin">
          {{ useFromMicroAmount(trader.volume).toLocaleString() }} BTSG |
          {{ trader.mints }} mints {{ trader.burns }} burns
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
export interface TopTraderItem {
  rank: number;
  address: string;
  username?: string;
  avatar?: string;
  volume: number;
  mints: number;
  burns: number;
}

const props = defineProps<{
  trader: TopTraderItem;
}>()
</script>