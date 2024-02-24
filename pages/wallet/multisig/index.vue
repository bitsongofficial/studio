<template>
  <AppPage>
    <template #title>
      Multisig Wallet
    </template>
    <template #append>
      <v-btn prepend-icon="mdi-plus" to="/wallet/multisig/new">New Multisig</v-btn>
    </template>
    <template #body>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card :disabled="isLoading">
              <v-table hover>
                <thead>
                  <tr>
                    <th :style="{ width: '350px' }">Name</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody v-if="data?.length">
                  <tr v-for="wallet in data" :key="wallet.id" :style="{ cursor: 'pointer' }"
                    @click="navigateTo(`/wallet/multisig/${wallet.id}`)">
                    <td>{{ wallet.name || '-' }}</td>
                    <td>{{ wallet.id || '-' }}</td>
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

const { isLoading, isPending, isFetching, isError, data, error, suspense } = useQuery({
  queryKey: ['wallet', 'multisig', user.value?.address],
  queryFn: async () => await $studio.admin.multisig.listWallets.query()
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})
</script>