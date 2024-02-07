<template>
  <v-dialog persistent width="466" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card :disabled="loading">
      <v-toolbar color="transparent">
        <v-toolbar-title> {{ toolbarTitle }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <v-row class="d-flex">
          <v-col cols="3">
            <v-img v-if="props.image" :src="useIpfsLink(props.image)"></v-img>
          </v-col>
          <v-col col="auto">
            <div class="text-h5">{{ title }}</div>
            <div class="text-body-2" v-if="side === 'buy'">
              <span class="text-grey">buy @</span>
              {{ buyPrice.totalPrice }} BTSG
            </div>
            <div class="text-body-2" v-else>
              <span class="text-grey">sell @</span>
              {{ sellPrice.totalPrice }} BTSG
            </div>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" no-gutters class="mt-2">
          <v-col cols="10">
            <v-container fluid>
              <v-row>
                <v-col class="text-center">
                  <v-btn :disabled="amount <= 1" variant="text" color="white" icon="mdi-chevron-left"
                    @click="amount--"></v-btn>
                </v-col>
                <v-col class="text-center">
                  <v-text-field variant="solo-filled" v-model="amount" hide-details></v-text-field>
                </v-col>
                <v-col class="text-center">
                  <v-btn variant="text" color="white" icon="mdi-chevron-right" @click="amount++"></v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters>
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Base Price
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(buyPrice.basePrice) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Creator Fee
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(buyPrice.creatorFee) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Referral Fee
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(buyPrice.referralFee) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Protocol Fee
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(buyPrice.protocolFee) }} BTSG
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-1">
          <v-col>
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Avg. Price
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(buyPrice.avgPrice) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" class="mt-2" no-gutters>
          <v-col cols="auto" class="text-surface-variant">
            Min. Bid:
          </v-col>
          <v-col cols="auto" class="mr-1">
            {{ formatCoinAmount(minBid) }} BTSG
          </v-col>
        </v-row>

        <v-row align="center" justify="space-between">
          <v-col cols="auto" class="text-h4">
            <div class="text-surface-variant">Your bid</div>
            <div>{{ formatCoinAmount(yourBid) }} <span class="text-surface-variant text-h5">BTSG</span></div>
          </v-col>
          <v-col cols="auto">
            <v-btn @click.stop="multiply" color="surface-variant" variant="tonal">x1.10</v-btn>
          </v-col>
        </v-row>

        <v-row v-if="bidDiffPerc > 50">
          <v-col>
            <v-alert icon="mdi-alert" color="red">
              Your bid is {{ bidDiffPerc.toFixed(2) }}% higher than the minimum bid
            </v-alert>
          </v-col>
        </v-row>
        {{ config }}aa
        <v-row>
          <v-col>
            <v-btn v-if="side === 'buy'" :disabled="bidDiffPerc > 250" color="green" block rounded="xl" size="large"
              @click.stop="onBuy" :loading="loading">
              Buy
            </v-btn>
            <v-btn v-else-if="side === 'sell' && isAllowedToSell" color="red" block rounded="xl" size="large"
              @click.stop="onSell" :disabled="!canSell" :loading="loading">
              Sell
            </v-btn>
            <v-btn v-else-if="!isAllowedToSell" variant="text" color="red" block rounded="xl" size="large"
              @click.stop="onAllow" :loading="loading">
              Authorize Sell
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { contracts } from "@bitsongjs/telescope";

interface Props {
  modelValue: boolean;
  side?: "buy" | "sell";
  marketplaceAddress: string
  nftAddress: string
  image?: string | null;
  title?: string | null;
  creator?: string | null;
  config: CurveOptions;
}

const props = defineProps<Props>()
const config = toRef(props, "config")

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const loading = ref(false);

const toolbarTitle = computed(() => {
  if (props.side === "buy") {
    return "Buy " + props.title;
  } else {
    return "Sell " + props.title;
  }
});

const _config = computed(() => props.config)

const { amount, buyPrice, sellPrice } = useCurveSimulator(_config.value);
const minBid = computed(() => {
  return props.side === "buy" ? buyPrice.value.totalPrice : sellPrice.value.totalPrice;
});

const yourBid = ref<number>(0);
const tokenIds = ref<string[]>([]);
const isAllowedToSell = ref(false);

watch(buyPrice, (newVal) => {
  yourBid.value = newVal.totalPrice;
}, {
  immediate: true,
  deep: true
})

const bidDiffPerc = computed(() => {
  return (yourBid.value - minBid.value) / minBid.value * 100
});

function multiply() {
  yourBid.value = parseFloat((toValue(yourBid) * 1.1).toFixed(6));
}

function reset() {
  loading.value = false;
  // formData.amount = 1;
  // formData.maxBid = 0;
  // formData.tokenIds = [];
  // formData.isAllowedToSell = false;
}

// watch(() => props.modelValue, async (value) => {
//   if (!value) {
//     reset();
//   } else {
//     if (props.side === "buy") {
//       formData.maxBid = useFromMicroAmount(props.buy_price);
//     } else {
//       formData.maxBid = useFromMicroAmount(props.sell_price);
//     }
//     await fetchConfig();
//   }
// });

const { Bs721CurveClient } = contracts.Bs721Curve;
const { Bs721BaseQueryClient, Bs721BaseClient } = contracts.Bs721Base;

async function fetchConfig() {
  const address = getAddress("bitsong");

  const bs721QueryClient = new Bs721BaseQueryClient(
    await useQueryClient("bitsong"),
    props.nftAddress,
  );

  const { tokens } = await bs721QueryClient.tokens({
    limit: 100,
    owner: address,
  });
  tokenIds.value = tokens;

  if (!isAllowedToSell.value) {
    const { operators } = await bs721QueryClient.allOperators({
      owner: address,
    });
    isAllowedToSell.value = operators.some((op) => op.spender === props.marketplaceAddress);
  }
}

const canSell = computed(() => {
  const amt = Number(amount.value);

  if (amt <= 0) {
    return false;
  }

  return tokenIds.value.length >= amt;
});

function getMaxTokenIds(amt: number): number[] {
  return toValue(tokenIds)
    .map(Number)
    .sort((a, b) => b - a)
    .slice(0, amt);
}

const { success, error } = useNotify()

async function onBuy() {
  loading.value = true;

  try {
    const address = getAddress("bitsong");

    const curveClient = new Bs721CurveClient(
      await useCWClient(),
      address,
      toValue(props.marketplaceAddress),
    );

    await curveClient.mint(
      {
        amount: toValue(amount),
        //referral: referralAddress,
      },
      "auto",
      "",
      [{ amount: useToMicroAmount(toValue(yourBid)).toString(), denom: "ubtsg" }],
    );

    success("Transaction success")
    umTrackEvent('buy-nft', { nftAddress: props.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } catch (e) {
    error((e as Error).message)
    umTrackEvent('buy-nft-error', { nftAddress: props.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } finally {
    await fetchConfig();
    loading.value = false;
    emits("update:modelValue", false)
  }
}

async function onSell() {
  loading.value = true;

  try {
    const address = getAddress("bitsong");

    const curveClient = new Bs721CurveClient(
      await useCWClient(),
      address,
      toValue(props.marketplaceAddress),
    );

    const tx = await curveClient.burn(
      {
        tokenIds: getMaxTokenIds(toValue(amount)),
        // @ts-ignore
        minOutAmount: useToMicroAmount(toValue(formData.maxBid)).toString(),
        //referral: referralAddress,
      },
      "auto",
      "",
      [],
    );

    success("Transaction success")
    umTrackEvent('sell-nft', { nftAddress: props.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } catch (e) {
    error((e as Error).message)
    umTrackEvent('sell-nft-error', { nftAddress: props.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } finally {
    await fetchConfig();
    loading.value = false;
    emits("update:modelValue", false)
  }
}

async function onAllow() {
  loading.value = true;

  try {
    const address = getAddress("bitsong");

    const bs721Client = new Bs721BaseClient(
      await useCWClient(),
      address,
      toValue(props.nftAddress),
    );

    const tx = await bs721Client.approveAll(
      {
        operator: props.marketplaceAddress,
      },
      "auto",
      "",
      [],
    );

    success("Transaction success")
    umTrackEvent('allow-sell-nft', { nftAddress: props.nftAddress })
  } catch (e) {
    error((e as Error).message)
    umTrackEvent('allow-sell-nft-error', { nftAddress: props.nftAddress })
  } finally {
    await fetchConfig();
    loading.value = false;
  }
}
</script>