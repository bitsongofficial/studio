<template>
  <AppPage>
    <template #title>
      <v-btn icon="mdi-arrow-left" variant="text" color="surface-variant" @click="router.back()"></v-btn>
      {{ data?.name }}
    </template>
    <template #append>
      <v-btn @click="onCreateTx">New Tx</v-btn>
    </template>
    <template #body>
      <v-container fluid v-if="data">
        <v-row>
          <v-col cols="5">
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Address</v-card-title>
              <div class="d-flex align-center pl-4 mt-n2 mb-1">
                <pre>{{ data?.id }}</pre>
                <AppCopyBtn :text="data?.id" />
              </div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Available Balance</v-card-title>
              <v-card-text class="text-h6">{{ useFromMicroAmount(parseInt(data.balance)) }} BTSG</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Account</v-card-title>
              <v-card-text class="text-h6">{{ data.account_number }}</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Sequence</v-card-title>
              <v-card-text class="text-h6">{{ data.sequence }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-tabs v-model="tab">
              <v-tab value="members">Members</v-tab>
              <v-tab value="queue">Queue <v-chip size="small" class="ml-2 mt-n1" rounded color="primary">
                  {{ queueTxs?.length }}
                </v-chip>
              </v-tab>
              <v-tab value="history">History <v-chip size="small" class="ml-2 mt-n1" rounded color="primary">1</v-chip>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'members'">
          <v-col cols="12">
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th :style="{ width: '100px' }">#</th>
                    <th :style="{ width: '250px' }">Name</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(member, index) in data.members" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ member.name }}</td>
                    <td>{{ member.address }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'queue'">
          <v-col cols="12">
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th>Sequence</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tx, index) in queueTxs" :key="index" :style="{ cursor: 'pointer' }"
                    @click="navigateTo(`/wallet/multisig/${walletAddress}/tx/${tx.id}`)">
                    <td>{{ tx.sequence }}</td>
                    <td>{{ tx.title }}</td>
                    <td>{{ tx.status }}</td>
                    <td>{{ tx.created_at.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'history'">
          <v-col cols="12">
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Tx History</v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Fee</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2021-10-01</td>
                      <td>0x1234...5678</td>
                      <td>0x1234...5678</td>
                      <td>0.00 BTSG</td>
                      <td>0.00 BTSG</td>
                      <td>Success</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
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

const tab = ref('members')

const { $studio } = useNuxtApp();
const user = useUserState()

const { isLoading, isPending, isFetching, isError, data, error, suspense } = useQuery({
  queryKey: ['wallet', 'multisig', user.value?.address, walletAddress],
  queryFn: async () => await $studio.admin.multisig.getWallet.query({
    address: walletAddress.value
  })
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})

const queueTxs = computed(() => {
  return data.value?.txs.filter((tx) => tx.status === 'Pending_Signatures')
})

function onCreateTx() {
  if (parseInt(data.value?.account_number ?? '0') === 0) {
    alert('To create a transaction, the multisig account needs to have at least one prior tx of receiving funds from another address')
    return
  }

  navigateTo(`/wallet/multisig/${walletAddress.value}/tx/new`)
}
</script>