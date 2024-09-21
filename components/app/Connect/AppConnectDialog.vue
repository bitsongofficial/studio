<template>
  <v-dialog width="350" :model-value="props.modelValue" :persistent="persistent"
    @update:model-value="$emit('update:modelValue', $event)">

    <v-card v-if="!connecting && !selectedWallet || disconnected && !connecting" class="connect_dialog__toolbar">
      <template #title>
        <v-row align="center" class="mr-0 pr-0">
          <v-col class="mt-1">
            <span class="text-h6">Connect Wallet</span>
          </v-col>
          <v-col cols="auto">
            <v-btn icon="mdi-close" variant="text" color="surface-variant" @click="emits('update:modelValue', false)" />
          </v-col>
        </v-row>
      </template>
      <v-card-text class="text-surface-variant text-subtitle-1 pb-2">
        To interact with BitSong Studio, you need to connect a wallet.
      </v-card-text>

      <v-list class="mb-1 mx-2 mr-2">
        <template v-for="wallet in wallets" :key="wallet.options.wallet_name">
          <v-list-item
            v-if="(isDev && wallet.options.wallet_name === 'telegram') || wallet.options.wallet_name !== 'telegram'"
            rounded="lg" class="mx-2 pa-2" :prepend-avatar="wallet.logoLight" :title="wallet.options.pretty_name"
            @click="open(wallet.options);">
            <template v-if="wallet.injected" #subtitle>
              Connect with {{ wallet.options.pretty_name }}
            </template>
            <template v-else #subtitle>
              Install {{ wallet.options.pretty_name }}
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-card>

    <v-card v-if="connecting && selectedWallet && !selectedWallet.mobile && !showError" min-height="330">
      <v-card-text class="d-flex">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="80" class="mb-4" width="3">
              <img :src="selectedWallet.images[0].png" alt="" style="width:32px; height:32px">
            </v-progress-circular>

            <div class="text-h6 mb-2">Waiting for {{ selectedWallet.pretty_name }}</div>
            <div class="text-subtitle-2 font-weight-light text-surface-variant">Don't see your wallet? Check your other
              browser windows.
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn block disabled variant="flat">Connecting</v-btn>
      </v-card-actions>
      <v-card-actions class="px-6">
        <v-btn block disabled color="surface-variant" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="selectedWallet && selectedWallet.mobile && !showError" min-height="330">
      <v-card-text class="d-flex">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">

            <div class="mt-4 text-subtitle-2 font-weight-light text-surface-variant">Scan the QR code with your wallet
              to
              connect
            </div>
            <div class="text-h6"> {{ selectedWallet.pretty_name }}</div>

            <VueQrcode v-if="pairingURI" class="my-4 rounded-xl" :value="pairingURI" type="image/png"
              :color="{ dark: '#000000ff', light: '#ffffffff' }" />
            <v-progress-circular v-else indeterminate color="primary" size="120" class="my-8" width="3">
              <img :src="selectedWallet.images[0].png" alt="" style="width:55px; height:55px">
            </v-progress-circular>

            <div class="text-subtitle-2 font-weight-light text-surface-variant">Don't have {{ selectedWallet.pretty_name
              }} installed?</div>

            <div v-for="platform in selectedWallet.platforms" :key="platform.platform"
              class="text-subtitle-2 font-weight-light">
              <a :href="platform.install_link" target="_blank" class="text-primary">Install
                {{ selectedWallet.pretty_name }} for {{ platform.platform.toUpperCase() }}
              </a>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn block color="surface-variant" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>

    <v-card min-height="330" v-if="showError && selectedWallet">
      <v-card-text class="d-flex">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular color="primary" size="80" class="mb-4" width="3">
              <img :src="selectedWallet.images[0].png" alt="" style="width:32px; height:32px">
            </v-progress-circular>
            <div class="text-h6 mb-2">Could not log in with {{ selectedWallet.pretty_name }}</div>
            <div class="text-subtitle-2 font-weight-light text-surface-variant">Please try connecting again </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-btn block variant="flat" @click="open(selectedWallet)">Retry</v-btn>
      </v-card-actions>
      <v-card-actions class="px-6">
        <v-btn block color="surface-variant" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useConnect, useConfig } from "@quirks/vue";
import { suggestChains } from "@quirks/store";
import { bitsong as bitsongConfig, bitsongAssetList } from "@nabla-studio/chain-registry";
import VueQrcode from "vue-qrcode";
import type { WalletOptions } from "@quirks/core";

const isDev = computed(() => import.meta.dev || useRoute().query.dev === "true");

// TODO: Timed out status???

const bitsong = {
  ...bitsongConfig,
  apis: {
    rpc: [
      {
        address: "https://rpc.explorebitsong.com",
        provider: "bitsong-team"
      }
    ],
    rest: [
      {
        address: "https://lcd.explorebitsong.com",
        provider: "bitsong-team"
      },
    ]
  },
}

const { wallets } = useConfig();
const { connect, connecting, disconnect, disconnected } = useConnect();
const { pairingURI } = useWalletConnect();

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);

const selectedWallet = ref<WalletOptions | null>(null);
const showError = ref(false);

function createTGPairUri(pairUri: string) {
  let uri = pairUri.replace('relay-protocol', 'r');

  // 2. change expiryTimestamp to e
  uri = uri.replace('expiryTimestamp', 'e');

  // 3. change symKey to s
  uri = uri.replace('symKey', 's');

  // 4. convert to base64
  return btoa(uri);
}

watch(pairingURI, (newVal) => {
  if (!newVal) return;

  if (selectedWallet.value?.wallet_name === "telegram") {
    window.open(`https://t.me/grammos_preview_bot/app?mode=compact&startapp=${createTGPairUri(newVal)}`, "_blank");
  }
})

const open = async (opts: WalletOptions) => {
  selectedWallet.value = opts;

  try {
    const wallet = wallets.value.find((w) => w.options.wallet_name === opts.wallet_name);
    if (wallet && !wallet.injected && Array.isArray(wallet.options.platforms) && wallet.options.platforms.length > 0) {
      window.open(wallet.options.platforms[0].install_link, "_blank");
      return
    }

    await suggestChains(opts.wallet_name, [
      { chain: bitsong, assetList: bitsongAssetList, name: "bitsong" },
    ]);

    showError.value = false;

    await connect(opts.wallet_name);
    useAppEvent('connect-wallet', { provider: opts.pretty_name });
    emits("update:modelValue", false);

    //selectedWallet.value = null;
  } catch (e) {
    console.error(e);
    showError.value = true;
  }
};

const cancel = () => {
  if (selectedWallet.value?.mobile) {
    disconnect();
  }

  showError.value = false;
  selectedWallet.value = null;
};

onUnmounted(() => {
  showError.value = false;
  selectedWallet.value = null;
});

const persistent = computed(() => {
  return connecting.value && selectedWallet.value?.wallet_name || showError.value;
});
</script>

<style>
.connect_dialog__toolbar>.v-card-item {
  padding: 16px 0 16px 24px !important;
}
</style>