<template>
  <AppPage>
    <template #title>
      <v-btn icon="mdi-arrow-left" variant="text" color="surface-variant" @click="router.back()"></v-btn>
      {{ tx?.title }}
    </template>
    <template #append>
      <v-btn @click="onSign">Sign Tx</v-btn>
    </template>
    <template #body>
      <v-container fluid v-if="tx">
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Created At</v-card-title>
              <v-card-text class="text-h6">{{ tx.created_at.toLocaleString() }}</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Threshold</v-card-title>
              <v-card-text class="text-h6">{{ signatureCount }} / {{ tx.wallet?.threshold }}</v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-card-title class="text-surface-variant text-body-2">Simulation</v-card-title>
              <v-card-text class="text-h6">-</v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-tabs v-model="tab">
              <v-tab value="detail">Detail</v-tab>
              <v-tab value="signatures">Signatures <v-chip size="small" class="ml-2 mt-n1" rounded color="primary">
                  {{ signatureCount }}
                </v-chip>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row v-if="tab === 'detail'">
          <v-col>
            <vue-json-pretty :data="JSON.parse(tx.data)" />
          </v-col>
        </v-row>

        <v-row v-if="tab === 'signatures'">
          <v-col>
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Signer</th>
                    <th>Status</th>
                    <th>Signed At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in tx.wallet?.members" :key="member.index">
                    <td>{{ member.index }}</td>
                    <td class="py-2">
                      <div class="text-body-1 mb-1">{{ member.name }}</div>
                      <div class="text-surface-variant">{{ member.address }}</div>
                    </td>
                    <td>
                      {{
                        (tx.signatures.find(
                          (sig) => sig.address === member.address)?.signature !== ''
                          && tx.signatures.find((sig) => sig.address === member.address)?.signature !== undefined
                        ) ? 'Signed' : 'Not Signed'
                      }}
                    </td>
                    <td>{{ tx.signatures.find((sig) => sig.address === member.address)?.created_at }}</td>
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
import type { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/amino";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import { useQuery } from '@tanstack/vue-query'

import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { getSigningBitsongClient } from "@bitsongjs/telescope";
import { getOfflineSigner } from "@quirks/store";

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

const { isLoading, isPending, isFetching, isError, data: tx, error, suspense } = useQuery({
  queryKey: ['wallet', 'multisig', user.value?.address, walletAddress, txId],
  queryFn: async () => await $studio.admin.multisig.getTx.query({
    wallet: walletAddress.value,
    id: txId.value
  })
})

onServerPrefetch(async () => {
  await suspense().catch((e) => console.log((e as Error).message))
})

const signatureCount = computed(() => {
  return tx.value?.signatures.filter((sig) => sig.signature !== '').length
})

async function onSign() {
  try {
    if (tx.value === undefined) return

    //const msgs = JSON.parse(tx.value.data).body.messages
    // const msgs = JSON.parse(tx.value.data).body.messages.map((msg: any) => {
    //   return {
    //     typeUrl: msg['@type'],
    //     value: {
    //       ...msg
    //     }
    //   }
    // }) as EncodeObject[]

    const cosmos = (await import("@bitsongjs/telescope")).cosmos
    const { toAmino, aminoType } = cosmos.bank.v1beta1.AminoConverter["/cosmos.bank.v1beta1.MsgSend"]

    const msgs = [
      {
        typeUrl: aminoType,
        value: toAmino({
          fromAddress: "",
          toAddress: "",
          amount: [{ denom: "ubtsg", amount: "1000000" }]
        })
      }
    ]

    const fees = JSON.parse(tx.value.data).auth_info.fee as StdFee


    const signer = await getOfflineSigner("bitsong-2b", "amino");
    console.log(await signer.getAccounts())
    const client = await getSigningBitsongClient({
      rpcEndpoint: "https://rpc.explorebitsong.com",
      signer,
    })
    console.log(await client.getChainId())
    console.log('signerAddress', walletAddress.value)
    console.log('msgs', msgs)
    console.log('fees', fees)
    console.log('accountNumber', parseInt(tx.value.account_number))
    console.log('sequence', parseInt(tx.value.sequenceReal))
    const { signatures } = await client.sign(
      (await signer.getAccounts())[0].address, msgs, fees, "", {
      accountNumber: parseInt(tx.value.account_number),
      sequence: parseInt(tx.value.sequenceReal),
      chainId: "bitsong-2b",
    })
    console.log(signatures)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style>
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  background-color: #121212;
  cursor: pointer;
}
</style>