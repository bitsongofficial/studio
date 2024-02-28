<template>
  <AppPage>
    <template #title>
      Multisig Wallet
    </template>
    <template #append>
      <v-btn prepend-icon="mdi-plus" to="/wallet/multisig/new">New Multisig</v-btn>
    </template>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card :disabled="isLoading">
              <v-table hover>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Members</th>
                  </tr>
                </thead>
                <tbody v-if="wallets?.length">
                  <tr v-for="wallet in wallets" :key="wallet?.address" :style="{ cursor: 'pointer' }"
                    @click="navigateTo(`/wallet/multisig/${wallet?.address}`)">
                    <td>{{ wallet?.address }}</td>
                    <td>{{ wallet?.voters }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td :colspan="2" class="text-center text-body-1">No multisig wallet found</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  middleware: ["protected"]
});

const { $studio } = useNuxtApp();
const user = useUserState()

const { isLoading, isPending, isFetching, isError, data: wallets, error, suspense } = useQuery({
  queryKey: ['wallet', 'multisig', user.value?.address],
  queryFn: async () => await $studio.protected.multisig.listWallets.query({ address: user.value?.address! })
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})
</script>