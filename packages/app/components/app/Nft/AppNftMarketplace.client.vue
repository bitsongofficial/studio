<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <div class="text-grey text-body-2">Buy Price</div>
        <v-skeleton-loader v-if="loading" class="mx-auto" type="text"></v-skeleton-loader>
        <div v-else>{{ formatCoinAmount(buyPrice.totalPrice) }}<br /><span class="text-subtitle-2">BTSG</span>
        </div>
      </v-col>

      <v-col class="text-center">
        <div class="text-grey text-body-2">Last Price</div>
        <v-skeleton-loader v-if="!lastPrice || lastPrice === 0" class="mx-auto" type="text"></v-skeleton-loader>
        <div v-else class="text-grey">
          {{ formatCoinAmount(useFromMicroAmount(lastPrice ?? 0)) }}<br /><span class="text-subtitle-2">BTSG</span>
        </div>
      </v-col>

      <v-col class="text-center">
        <div class="text-grey text-body-2">Sell Price</div>
        <v-skeleton-loader v-if="loading" class="mx-auto" type="text"></v-skeleton-loader>
        <div v-else>{{ formatCoinAmount(sellPrice.totalPrice) }}<br /><span class="text-subtitle-2">BTSG</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex align-center pb-4 justify-space-between">
        <AppConnectBtn v-if="!connected" />
        <v-btn v-if="connected" color="green" rounded="xl" size="large" width="170" @click.stop="openBuyDialog">
          Buy
        </v-btn>
        <v-btn v-if="connected" color="red" rounded="xl" width="170" size="large" @click.stop="openSellDialog">
          Sell
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <AppNftCurveDialog v-if="loaded" v-model="marketplaceDialog" :side="marketplaceSide" :title="title" :image="image"
    :contract-config="contractConfig" />
</template>

<script setup lang="ts">

const { error } = useNotify()
const { connected } = useConnect();

const emits = defineEmits<{
  (e: "openDialog", value: "buy" | "sell"): void;
}>();

const props = defineProps<{
  marketplaceAddress: string;
  nftAddress: string;
  image?: string;
  title?: string;
  lastPrice?: number;
  creator?: string | null;
}>();

const { marketplaceAddress, nftAddress, image, title, lastPrice } = toRefs(props)

const loading = ref(true)
const loaded = ref(false)
const marketplaceDialog = ref(false)
const marketplaceSide = ref<'buy' | 'sell'>('buy')

const contractConfig = shallowRef({
  marketplaceAddress: marketplaceAddress.value,
  nftAddress: nftAddress.value,
  ratio: 0,
  sellerFeeBps: 0,
  referralFeeBps: 0,
  protocolFeeBps: 0,
  totalSupply: 0,
})

const { buyPrice, sellPrice } = useCurveSimulator(contractConfig);

async function fetchConfigAndSupply() {
  try {
    const { restAddress } = useRuntimeConfig().public

    const configQuery = btoa(`{"get_config":{}}`);
    const configUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${toValue(marketplaceAddress)}/smart/${configQuery}`;

    const supplyQuery = btoa(`{"num_tokens":{}}`);
    const supplyUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${toValue(nftAddress)}/smart/${supplyQuery}`;

    interface QueryConfigResponse {
      data: {
        ratio: number
        seller_fee_bps: number
        referral_fee_bps: number
        protocol_fee_bps: number
        max_edition?: number
        max_per_address?: number
      }
    }

    interface QuerySupplyResponse {
      data: {
        count: number
      }
    }

    const [config, supply] = await Promise.all([
      $fetch<QueryConfigResponse>(configUrl),
      $fetch<QuerySupplyResponse>(supplyUrl),
    ]);

    contractConfig.value = {
      marketplaceAddress: marketplaceAddress.value,
      nftAddress: nftAddress.value,
      ratio: config.data.ratio,
      sellerFeeBps: config.data.seller_fee_bps,
      referralFeeBps: config.data.referral_fee_bps,
      protocolFeeBps: config.data.protocol_fee_bps,
      totalSupply: supply.data.count,
    }

    loading.value = false
    loaded.value = true
  } catch (e) {
    error('Error fetching marketplace data')
  }
}

function openBuyDialog() {
  marketplaceSide.value = 'buy'
  marketplaceDialog.value = true
  umTrackEvent('open-buy-dialog')
}

function openSellDialog() {
  marketplaceSide.value = 'sell'
  marketplaceDialog.value = true
  umTrackEvent('open-sell-dialog')
}

let interval: string | number | NodeJS.Timeout | undefined;

onMounted(async () => {
  interval = setInterval(async () => {
    await fetchConfigAndSupply()
  }, 1000);
})

onUnmounted(() => {
  clearInterval(interval as number)
})
</script>