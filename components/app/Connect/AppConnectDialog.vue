<template>
  <v-dialog width="350" :model-value="props.modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>Connect Wallet</v-card-title>
      <v-list class="mb-1">
        <v-list-item v-for="wallet in wallets" :key="wallet.options.name" class="mx-2 pa-2"
          :prepend-avatar="`/images/wallets/${wallet.options.name}.png`" :title="wallet.options.prettyName"
          @click.stop="open(wallet.options.name)">
          <template #subtitle v-if="wallet.injected">
            Connect with {{ wallet.options.prettyName }}
          </template>
          <template #subtitle v-else>
            Install {{ wallet.options.prettyName }}
          </template>
          <template v-slot:append>
            <v-progress-circular v-if="status === 'WAITING' && selectedWallet === wallet.options.name" indeterminate
              color="primary" size="22" width="3"></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useConnect, useConfig } from "@quirks/vue";
import { suggestChains, signArbitrary, getAddress } from "@quirks/store";
import { bitsong, bitsongAssetList } from "@nabla-studio/chain-registry";

const { wallets } = useConfig();
const { connect, status } = useConnect();

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);

const selectedWallet = ref("");

const open = async (walletName: string) => {
  selectedWallet.value = walletName;

  const wallet = wallets.value.find((w) => w.options.name === walletName);
  if (wallet && !wallet.injected && Array.isArray(wallet.options.downloads) && wallet.options.downloads.length > 0) {
    window.open(wallet.options.downloads[0].link, "_blank");
    return
  }

  await suggestChains(walletName, [
    { chain: bitsong, assetList: bitsongAssetList, name: "bitsong" },
  ]);
  await connect(walletName);

  emits("update:modelValue", false);
};
</script>