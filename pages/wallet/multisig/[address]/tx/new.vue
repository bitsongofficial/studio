<template>
  <AppPage>
    <template #title>
      <v-btn icon="mdi-arrow-left" variant="text" color="surface-variant" @click="router.back()"></v-btn>
      New Tx
    </template>
    <template #body>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="title" label="Title" variant="outlined" dense required></v-text-field>
                <v-text-field v-model="description" label="Description (optional)" variant="outlined"
                  dense></v-text-field>

                <h3 class="text-h6 mb-2">Transaction Data</h3>
                <v-textarea v-model="txData" label="Transaction Data" variant="outlined"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-right">
                <v-btn color="primary" @click="onSaveTx" :loading="loading">
                  Save Tx
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
import { encodeSecp256k1Pubkey } from '@cosmjs/amino';
import type { SignerData } from '@cosmjs/stargate';
import { getOfflineSigner } from '@quirks/store';
import { Any } from "cosmjs-types/google/protobuf/any";
import { encodePubkey } from "@cosmjs/proto-signing";
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { TxRaw, Tx, AuthInfo, Fee, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

definePageMeta({
  middleware: ["protected"]
});

const router = useRouter()
const route = useRoute()
const walletAddress = computed(() => route.params.address as string)

const title = ref("");
const description = ref("");
const txData = ref("");
const memo = ref("");
const loading = ref(false);

const { $studio } = useNuxtApp()
const { success, error: errorNotify } = useNotify()
async function onSaveTx() {
  try {
    loading.value = true

    const cosmos = (await import("@bitsongjs/telescope")).cosmos
    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

    const msgs = [
      send({
        amount: [
          {
            denom: 'ubtsg',
            amount: '1',
          },
        ],
        toAddress: walletAddress.value,
        fromAddress: walletAddress.value,
      })
    ];

    const fee = await useEstimateFee("bitsong", walletAddress.value, msgs)
    console.log(fee)
    return

    // const offlineSigner = await getOfflineSigner("bitsong", "amino")
    // const pubkey = encodeSecp256k1Pubkey((await offlineSigner.getAccounts())[0].pubkey);
    // const address = getAddress("bitsong")

    // const client = await useSigningStargateClient("bitsong");
    // const account = await client.getAccount(walletAddress.value);
    // if (!account) {
    //   throw new Error("Please fund the multisig wallet first");
    // }

    // const signerData: SignerData = {
    //   accountNumber: account.accountNumber,
    //   sequence: account.sequence,
    //   chainId: "bitsong-2b",
    // }

    // const { bodyBytes, signatures } = await useMultisigSign("bitsong", msgs, fee, "amino", memo.value, signerData)

    const { id } = await $studio.admin.multisig.createTx.mutate({
      wallet: walletAddress.value,
      title: title.value,
      description: description.value,
      memo: memo.value,
      msgs: msgs,
      fee: fee as any,
      // bodyBytes
      // account
      // sequence
      // pubkey
      // address
      // signature
    })

    success("Transaction saved")
    navigateTo(`/wallet/multisig/${walletAddress.value}/tx/${id}`)
  } catch (err) {
    console.error(err)
    errorNotify("Failed to save transaction")
  } finally {
    loading.value = false
  }
}
</script>