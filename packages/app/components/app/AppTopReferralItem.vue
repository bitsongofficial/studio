<template>
  <v-card v-if="referral" class="pa-1 pa-md-3 px-4" variant="text" :to="`/u/${referral.address}`">
    <v-row class="align-center">
      <v-col cols="auto" class="text-h6" style="min-width: 46px;">
        {{ referral.rank }}
      </v-col>
      <v-col cols="auto">
        <NuxtLink>
          <v-avatar size="42">
            <v-img :src="avatar" :alt="referral.username || referral.address" cover></v-img>
          </v-avatar>
        </NuxtLink>
      </v-col>
      <v-col>
        <div class="text-subtitle-1">{{ referral.username ? referral.username : formatShortAddress(referral.address, 8) }}
        </div>
        <div class="text-subtitle-2 text-surface-variant font-weight-thin">
          {{ useFromMicroAmount(referral.total_earned).toLocaleString() }} BTSG |
          {{ referral.unique_users }} referred users
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import defaultImage from "@/assets/images/default.png";

const img = useImage();

export interface TopReferralItem {
  rank: number;
  address: string;
  username?: string;
  avatar?: string;
  total_earned: number;
  unique_users: number;
}

const props = defineProps<{
  referral?: TopReferralItem;
}>()

const avatar = computed(() => {
  return props.referral?.avatar ? img(useIpfsLink(props.referral.avatar)!, { width: 42, format: 'webp' }) : defaultImage;
});
</script>