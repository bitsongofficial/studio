<template>
  <v-dialog width="350" :model-value="props.modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card>
      <v-card-title>Connect Wallet</v-card-title>
      <VueQrcode v-if="pairingURI" :value="pairingURI" type="image/png"
        :color="{ dark: '#000000ff', light: '#ffffffff' }" />
      <v-list v-else class="mb-1">
        <v-list-item v-for="wallet in wallets" :key="wallet.options.wallet_name" class="mx-2 pa-2"
          :prepend-avatar="wallet.logoLight" :title="wallet.options.pretty_name"
          @click.stop="open(wallet.options.wallet_name); umTrackEvent('connect-wallet', { provider: wallet.options.wallet_name })">
          <template #subtitle v-if="wallet.injected">
            Connect with {{ wallet.options.pretty_name }}
          </template>
          <template #subtitle v-else>
            Install {{ wallet.options.prettyName }}
          </template>
          <template v-slot:append>
            <v-progress-circular v-if="connecting && selectedWallet === wallet.options.wallet_name" indeterminate
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
import VueQrcode from "vue-qrcode";

const { wallets } = useConfig();
const { connect, status, connecting } = useConnect();
const { pairingURI } = useWalletConnect();

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);

const selectedWallet = ref("");

const open = async (walletName: string) => {
  selectedWallet.value = walletName;

  const wallet = wallets.value.find((w) => w.options.wallet_name === walletName);
  if (wallet && !wallet.injected && Array.isArray(wallet.options.platforms) && wallet.options.platforms.length > 0) {
    window.open(wallet.options.platforms[0].install_link, "_blank");
    return
  }

  await suggestChains(walletName, [
    { chain: bitsong, assetList: bitsongAssetList, name: "bitsong" },
  ]);
  await connect(walletName);

  emits("update:modelValue", false);
};
</script>