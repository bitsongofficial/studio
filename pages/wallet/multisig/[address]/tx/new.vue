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
import { contracts } from "@bitsongjs/telescope";

definePageMeta({
  middleware: ["protected"]
});

const router = useRouter()
const route = useRoute()
const walletAddress = computed(() => route.params.address as string)

const title = ref("");
const description = ref("");
const txData = ref("");
const loading = ref(false);

const { success, error: errorNotify } = useNotify()
async function onSaveTx() {
  try {
    loading.value = true

    const { Cw3FixedMultisigClient } = contracts.Cw3FixedMultisig;

    const address = getAddress("bitsong");
    const cw3Client = new Cw3FixedMultisigClient(
      await useCWClient(),
      address,
      walletAddress.value
    );

    const response = await cw3Client.propose({
      title: title.value,
      description: description.value,
      msgs: JSON.parse(txData.value),
    })

    console.log(response.transactionHash)
    const proposalId = response.events[10].attributes[3].value

    success("Proposal created")
    navigateTo(`/wallet/multisig/${walletAddress.value}/tx/${proposalId}`)
  } catch (err) {
    console.error(err)
    errorNotify("Failed to create proposal")
  } finally {
    loading.value = false
  }
}
</script>