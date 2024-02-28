<template>
  <AppPage v-if="tx">
    <template #title>
      <v-btn icon="mdi-arrow-left" variant="text" color="surface-variant" @click="router.back()"></v-btn>
      #{{ tx.id }} {{ tx.title }}
    </template>
    <template #append>
      <v-btn v-if="canVote" :loading="loadingVote" @click="onVote">Vote Yes</v-btn>
      <v-btn v-if="tx.status === 'passed'" :loading="loadingExecute" @click="onExecute">Execute</v-btn>
    </template>
    <template #body>
      <v-container fluid class="pt-0">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Description</v-card-title>
              <v-card-text>{{ tx.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Status</v-card-title>
              <v-card-text>{{ tx.status }}</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Consensus</v-card-title>
              <v-card-text>{{ tx.current_consensus }}% / {{ tx.quorum }}%</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Expire</v-card-title>
              <v-card-text>{{ new Date(tx.expires.at_time / 1_000_000).toLocaleString() }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-tabs v-model="tab">
              <v-tab value="msgs">Messages</v-tab>
              <v-tab value="signatures">Votes <v-chip size="small" class="ml-2 mt-n1" rounded color="primary">
                  {{ tx.votes.length }}
                </v-chip>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'msgs'">
          <v-col>
            <vue-json-pretty :data="tx.msgs" />
          </v-col>
        </v-row>

        <v-row v-if="tab === 'signatures'">
          <v-col>
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Vote</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="({ voter, vote, weight }, index) in tx.votes" :key="index">
                    <td :style="{ width: '650px' }">{{ voter }}</td>
                    <td :style="{ width: '150px' }">{{ vote }}</td>
                    <td>{{ weight }}</td>
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
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import { useQuery } from '@tanstack/vue-query'
import { contracts } from "@bitsongjs/telescope";

definePageMeta({
  middleware: ["protected"]
});

const route = useRoute()
const walletAddress = computed(() => route.params.address as string)
const txId = computed(() => route.params.tx_id as string)

const router = useRouter()

const tab = ref('detail')

const { $studio } = useNuxtApp();
const user = useUserState()

const { isLoading, isPending, isFetching, isError, data: tx, suspense, refetch } = useQuery({
  queryKey: ['wallet', 'multisig', user.value?.address, walletAddress, txId],
  queryFn: async () => await $studio.protected.multisig.getTx.query({
    wallet: walletAddress.value,
    id: txId.value
  })
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})

const { success, error: errorNotify } = useNotify()
const { Cw3FixedMultisigClient } = contracts.Cw3FixedMultisig;

const loadingVote = ref(false)
async function onVote() {
  try {
    loadingVote.value = true

    const address = getAddress("bitsong");
    const cw3Client = new Cw3FixedMultisigClient(
      await useCWClient(),
      address,
      walletAddress.value
    );

    await cw3Client.vote({
      proposalId: parseInt(txId.value),
      vote: "yes"
    })

    success("Vote submitted")
    refetch()
  } catch (err) {
    console.error(err)
    errorNotify("Failed to submit vote")
  } finally {
    loadingVote.value = false
  }
}

const loadingExecute = ref(false)
async function onExecute() {
  try {
    loadingExecute.value = true

    const address = getAddress("bitsong");
    const cw3Client = new Cw3FixedMultisigClient(
      await useCWClient(),
      address,
      walletAddress.value
    );

    await cw3Client.execute({
      proposalId: parseInt(txId.value)
    })

    success("Proposal executed")
    refetch()
  } catch (err) {
    console.error(err)
    errorNotify("Failed to submit vote")
  } finally {
    loadingExecute.value = false
  }
}

const canVote = computed(() => {
  return tx.value?.status === 'open' && tx.value?.votes.some((v) => v.voter === user.value?.address && v.vote === '-')
})
</script>

<style>
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  background-color: #121212;
  cursor: pointer;
}
</style>