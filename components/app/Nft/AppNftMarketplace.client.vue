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
        <div class="text-grey">
          0<br /><span class="text-subtitle-2">BTSG</span>
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
        <v-btn v-if="connected" color="green" rounded="xl" size="large" width="170"
          @click.stop="$emit('openDialog', 'buy'); umTrackEvent('open-buy-dialog')">
          Buy
        </v-btn>

        <v-btn v-if="connected" color="red" rounded="xl" width="170" size="large"
          @click.stop="$emit('openDialog', 'sell'); umTrackEvent('open-sell-dialog')">
          Sell
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <AppNftCurveDialog v-if="toValue(_contractConfig.ratio) > 0" v-model="marketplaceDialog"
    :marketplaceAddress="props.marketplaceAddress" :nftAddress="props.nftAddress" :side="marketplaceSide"
    :image="props.image" :title="props.title" :creator="props.creator" :config="_contractConfig" />
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
  image?: string | null;
  title?: string | null;
  creator?: string | null;
}>();

const loading = ref(true)
const marketplaceDialog = ref(false)
const marketplaceSide = ref<'buy' | 'sell'>('buy')

const contractConfig = ref<CurveOptions>({
  ratio: 0,
  sellerFeeBps: 0,
  referralFeeBps: 0,
  protocolFeeBps: 0,
  totalSupply: 0,
})

const _contractConfig = computed(() => toValue(contractConfig))

const { buyPrice, sellPrice } = useCurveSimulator(contractConfig.value);

async function fetchConfigAndSupply() {
  try {
    const { restAddress } = useRuntimeConfig().public

    const configQuery = btoa(`{"get_config":{}}`);
    const configUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${props.marketplaceAddress}/smart/${configQuery}`;

    const supplyQuery = btoa(`{"num_tokens":{}}`);
    const supplyUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${props.nftAddress}/smart/${supplyQuery}`;

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

    contractConfig.value.ratio = config.data.ratio;
    contractConfig.value.sellerFeeBps = config.data.seller_fee_bps;
    contractConfig.value.referralFeeBps = config.data.referral_fee_bps;
    contractConfig.value.protocolFeeBps = config.data.protocol_fee_bps;
    contractConfig.value.totalSupply = supply.data.count;

    console.dir('contractConfig', toValue(contractConfig))

    loading.value = false
  } catch (e) {
    error('Error fetching marketplace data')
  }
}

onMounted(async () => {
  //await nextTick()
  await fetchConfigAndSupply()
})
</script>