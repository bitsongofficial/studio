<script lang="ts" setup>
import { useConfig, useConnect } from "@quirks/vue";
import { suggestChains } from "@quirks/store";
import { bitsong, bitsongAssetList } from "@nabla-studio/chain-registry";

const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);
const { wallets } = useConfig();
const { connect, status } = useConnect();

interface Props {
  modelValue: boolean;
}

const selectedWallet = ref("");

async function open(walletName: string) {
  selectedWallet.value = walletName;

  const wallet = wallets.value.find(w => w.options.name === walletName);
  if (wallet && !wallet.injected && Array.isArray(wallet.options.downloads) && wallet.options.downloads.length > 0) {
    window.open(wallet.options.downloads[0].link, "_blank");
    return;
  }

  await suggestChains(walletName, [
    { chain: bitsong, assetList: bitsongAssetList, name: "bitsong" },
  ]);
  await connect(walletName);

  emits("update:modelValue", false);
}
</script>

<template>
  <v-dialog width="350" :model-value="props.modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>Connect Wallet</v-card-title>
      <v-list class="mb-1">
        <v-list-item
          v-for="wallet in wallets" :key="wallet.options.name" class="mx-2 pa-2"
          :prepend-avatar="`/images/wallets/${wallet.options.name}.png`" :title="wallet.options.prettyName"
          @click.stop="open(wallet.options.name);"
        >
          <template v-if="wallet.injected" #subtitle>
            Connect with {{ wallet.options.prettyName }}
          </template>
          <template v-else #subtitle>
            Install {{ wallet.options.prettyName }}
          </template>
          <template #append>
            <v-progress-circular
              v-if="status === 'WAITING' && selectedWallet === wallet.options.name" indeterminate
              color="primary" size="22" width="3"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>
