<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="text-md-h4 text-h5 font-weight-bold text-surface-variant align-center d-flex pb-2">
          Top Referrals <v-chip class="ml-3" rounded>Last 7d</v-chip>
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col v-for="n in 3" :key="n" cols="12" md="4">
        <div v-for="i in 5" :key="i + (n - 1) * 5">
          <v-skeleton-loader v-if="pending" class="mr-4 mb-4" type="list-item-avatar-two-line"/>
          <AppTopReferralItem v-else :referral="data?.topReferrals[i + (n - 1) * 5 - 1]" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import type { TopReferralItem } from '~/components/app/AppTopReferralItem.vue';

const { data, pending, execute } = useAsyncData(async () => {
  const topReferrals = await $fetch(`/api/top_referrals`)

  return {
    topReferrals: topReferrals.map((referral, index) => ({
      rank: index + 1,
      address: referral.address,
      username: referral.username,
      avatar: referral.avatar,
      total_earned: referral.total_earned as number,
      unique_users: referral.unique_users as number,
    } as TopReferralItem)),
  }
}, {
  immediate: false
})

onMounted(() => {
  execute()
})

</script>