<template>
  <AppPage>
    <template #title>
      <v-btn icon="mdi-arrow-left" variant="text" color="surface-variant" @click="router.back()"></v-btn>
    </template>
    <template #append>
      <v-btn @click="navigateTo(`/wallet/multisig/${walletAddress}/tx/new`)">New Tx</v-btn>
    </template>
    <template #body>
      <v-container fluid v-if="data">
        <v-row>
          <v-col cols="8">
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Address</v-card-title>
              <div class="d-flex align-center pl-4 mt-n2 mb-1">
                <pre>{{ walletAddress }}</pre>
                <AppCopyBtn :text="walletAddress" />
              </div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Available Balance</v-card-title>
              <v-card-text class="text-h6">{{ useFromMicroAmount(parseInt(data.balance.amount)) }} BTSG</v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-tabs v-model="tab">
              <v-tab value="queue">Queue <v-chip size="small" class="ml-2 mt-n1" rounded color="primary">
                  {{ queuedProposals?.length }}
                </v-chip>
              </v-tab>
              <v-tab value="history">History <v-chip size="small" class="ml-2 mt-n1" rounded color="primary">
                  {{ historyProposals?.length }}
                </v-chip>
              </v-tab>
              <v-tab value="members">Members</v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'queue'">
          <v-col cols="12">
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Expire At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(proposal, index) in queuedProposals" :key="index" :style="{ cursor: 'pointer' }"
                    @click="navigateTo(`/wallet/multisig/${walletAddress}/tx/${proposal.id}`)">
                    <td>{{ proposal.id }}</td>
                    <td>{{ proposal.title }}</td>
                    <td>{{ proposal.status }}</td>
                    <td>{{ new Date(proposal.expires.at_time / 1_000_000).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'history'">
          <v-col cols="12">
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Expire At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(proposal, index) in historyProposals" :key="index" :style="{ cursor: 'pointer' }"
                    @click="navigateTo(`/wallet/multisig/${walletAddress}/tx/${proposal.id}`)">
                    <td>{{ proposal.id }}</td>
                    <td>{{ proposal.title }}</td>
                    <td>{{ proposal.status }}</td>
                    <td>{{ new Date(proposal.expires.at_time / 1_000_000).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'members'">
          <v-col cols="12">
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th :style="{ width: '650px' }">Address</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(member, index) in data.voters" :key="index">
                    <td>{{ member.addr }}</td>
                    <td>{{ member.weight }}</td>
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
const route = useRoute()
const walletAddress = computed(() => route.params.address as string)
const router = useRouter()

const tab = ref('queue')

const { $studio } = useNuxtApp();
const user = useUserState()

const { isLoading, isPending, isFetching, isError, data, error, suspense } = useQuery({
  queryKey: ['wallet', 'multisig', user.value?.address, walletAddress],
  queryFn: async () => await $studio.protected.multisig.getWallet.query({
    address: walletAddress.value
  })
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})

const queuedProposals = computed(() => {
  return data.value?.proposals.filter((proposal) => proposal.status === 'open' || proposal.status === 'passed')
})

const historyProposals = computed(() => {
  return data.value?.proposals.filter((proposal) => proposal.status !== 'open' && proposal.status !== 'passed')
})
</script>