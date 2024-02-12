<template>
  <v-dialog persistent width="466" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card :disabled="loading">
      <v-toolbar color="transparent">
        <v-toolbar-title> {{ side === 'buy' ? 'Buy' : 'Sell' }} {{ title }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <v-row class="d-flex">
          <v-col cols="3">
            <v-img v-if="image" :src="useIpfsLink(image)"></v-img>
          </v-col>
          <v-col col="auto">
            <div class="text-h5">{{ title }}</div>
            <div class="text-body-2">
              <span class="text-grey">{{ side }} @</span>
              {{ price.totalPrice }} BTSG
            </div>
          </v-col>
        </v-row>

        <v-row align="center" justify="center" no-gutters class="mt-2">
          <v-col cols="10">
            <v-container fluid>
              <v-row align="center">
                <v-col class="text-center">
                  <v-btn :disabled="amount <= 1" variant="text" color="white" icon="mdi-chevron-left"
                    @click="decrease"></v-btn>
                </v-col>
                <v-col class="text-center">
                  <v-text-field variant="solo-filled" v-model="amount" hide-details></v-text-field>
                </v-col>
                <v-col class="text-center">
                  <v-btn :disabled="!canIncrement" variant="text" color="white" icon="mdi-chevron-right"
                    @click="increase"></v-btn>
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
            {{ formatCoinAmount(price.basePrice) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Creator Fee
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(price.creatorFee) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Referral Fee
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(price.referralFee) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" no-gutters class="mt-1">
          <v-col cols="auto" class="text-surface-variant text-subtitle-2">
            Protocol Fee
          </v-col>
          <v-col cols="auto" class="mr-1 text-subtitle-2">
            {{ formatCoinAmount(price.protocolFee) }} BTSG
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
            {{ formatCoinAmount(price.avgPrice) }} BTSG
          </v-col>
        </v-row>

        <v-row justify="space-between" class="mt-2" no-gutters>
          <v-col cols="auto" class="text-surface-variant">
            {{ side === 'buy' ? 'Min.' : 'Max.' }} Bid
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
            <div>
              <v-btn :style="{ textTransform: 'none' }" @click.stop="multiply" color="surface-variant" variant="tonal">x{{
                sideMultiplier }}</v-btn>
            </div>
          </v-col>
        </v-row>

        <v-row v-if="bidDiffPerc > 50 && (canBuy || canSell)">
          <v-col>
            <v-alert icon="mdi-alert" color="red">
              Your bid is {{ bidDiffPerc.toFixed(2) }}% {{
                side === 'buy' ? 'higher' : 'lower'
              }} than the {{ side === 'buy' ? 'min.' : 'max.' }} bid
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div v-if="side === 'buy'">
              <v-alert color="red" icon="mdi-alert" v-if="!canBuy">
                You don't have enough BTSG to buy this Music NFT
              </v-alert>
              <v-btn v-else :disabled="bidDiffPerc > 250" color="green" block rounded="xl" size="large"
                @click.stop="onBuy" :loading="loading">
                Buy
              </v-btn>
            </div>
            <div v-else-if="side === 'sell'">
              <v-alert color="red" icon="mdi-alert" v-if="!canSell">
                You don't have enough Music NFTs to sell
              </v-alert>
              <div v-else>
                <v-btn v-if="isAllowedToSell" color="red" block rounded="xl" size="large" @click.stop="onSell"
                  :disabled="!canSell" :loading="loading">
                  Sell
                </v-btn>
                <v-btn v-else="!isAllowedToSell" variant="text" color="red" block rounded="xl" size="large"
                  @click.stop="onAllow" :loading="loading">
                  Authorize Sell
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { contracts } from "@bitsongjs/telescope";
import { parseCoins } from '@cosmjs/proto-signing'

export interface ContractConfig {
  marketplaceAddress: string;
  nftAddress: string;
  ratio: number;
  sellerFeeBps: number;
  referralFeeBps: number;
  protocolFeeBps: number;
  totalSupply: number;
}

const props = withDefaults(defineProps<{
  modelValue: boolean;
  side?: "buy" | "sell";
  title?: string;
  image?: string;
  contractConfig: ContractConfig;
}>(), {
  side: "buy",
  title: "",
  image: ""
});

const { modelValue, side, title, image, contractConfig } = toRefs(props);

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const loading = ref(false);

const { amount, buyPrice, sellPrice } = useCurveSimulator(contractConfig);

const price = computed(() => {
  return side.value === "buy" ? buyPrice.value : sellPrice.value;
});

const minBid = computed(() => price.value.totalPrice);

const yourBid = ref<number>(0);
const tokenIds = ref<string[]>([]);
const isAllowedToSell = ref(false);
const multiplier = ref(1);

const sideMultiplier = computed(() => {
  return side.value === "buy" ? 1.1 : 0.9;
});

watch(price, (newVal) => {
  yourBid.value = newVal.totalPrice * multiplier.value;
})

watch(yourBid, (newVal) => {
  if (newVal === 0) {
    yourBid.value = minBid.value;
    return
  }
});

const bidDiffPerc = computed(() => {
  if (side.value === "buy") {
    return (toValue(yourBid) - minBid.value) / minBid.value * 100;
  } else {
    return (minBid.value - toValue(yourBid)) / minBid.value * 100;
  }
});

function multiply() {
  multiplier.value = multiplier.value * sideMultiplier.value;
  yourBid.value = price.value.totalPrice * multiplier.value;
}

function decrease() {
  multiplier.value = 1;
  amount.value = amount.value - 1;
}

function increase() {
  multiplier.value = 1;
  amount.value = amount.value + 1;
}

function reset() {
  loading.value = false;
  amount.value = 1;
  yourBid.value = 0;
}

watch(modelValue, async (newVal) => {
  if (!newVal) {
    reset();
  } else {
    await fetchConfig()
  }
});

const { Bs721CurveClient } = contracts.Bs721Curve;
const { Bs721BaseQueryClient, Bs721BaseClient } = contracts.Bs721Base;

async function fetchConfig() {
  const address = getAddress("bitsong");

  const bs721QueryClient = new Bs721BaseQueryClient(
    await useQueryClient("bitsong"),
    contractConfig.value.nftAddress,
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
    isAllowedToSell.value = operators.some((op) => op.spender === contractConfig.value.marketplaceAddress);
  }
}

const canSell = computed(() => {
  const amt = Number(amount.value);

  if (amt <= 0) {
    return false;
  }

  return tokenIds.value.length >= amt;
});

const canBuy = computed(() => {
  const { balance } = useUserBalance()
  return balance.value >= useToMicroAmount(toValue(yourBid));
});

const canIncrement = computed(() => {
  return (side.value === "sell" && tokenIds.value.length > amount.value) || side.value === "buy";
});

function getMaxTokenIds(amt: number): number[] {
  return toValue(tokenIds)
    .map(Number)
    .sort((a, b) => b - a)
    .slice(0, amt);
}

const { success, error } = useNotify()
const { fetchBalance } = useUserBalance()

const parseCosmosError = (e: Error) => {
  if (e.message.includes("Query failed")) {
    const regex = /(\d+[a-zA-Z]+) is smaller than (\d+[a-zA-Z]+)/;
    const matches = e.message.match(regex);

    if (matches) {
      const _actualToken = matches[1];
      const _requiredTokens = matches[2];

      const [actualToken, requiredTokens] = parseCoins(`${_actualToken},${_requiredTokens}`);

      const actualTokenDenom = actualToken.denom.slice(1).toUpperCase();
      const requiredTokenDenom = requiredTokens.denom.slice(1).toUpperCase();

      return `You don't have enough ${requiredTokenDenom}. You need ${formatCoinAmount(useFromMicroAmount(parseInt(requiredTokens.amount)))} ${requiredTokenDenom} but you have ${formatCoinAmount(useFromMicroAmount(parseInt(actualToken.amount)))} ${actualTokenDenom}`;
    }

    return e.message;
  }

  return e.message;
};

async function onBuy() {
  loading.value = true;

  try {
    const address = getAddress("bitsong");

    const curveClient = new Bs721CurveClient(
      await useCWClient(),
      address,
      contractConfig.value.marketplaceAddress
    );

    let mintData = {
      amount: toValue(amount),
    }

    const { referral } = useReferral()
    if (referral.value) {
      mintData = {
        ...mintData,
        referral: toValue(referral)
      }
    }

    await curveClient.mint(mintData,
      "auto",
      "",
      [{ amount: useToMicroAmount(toValue(yourBid)).toString(), denom: "ubtsg" }],
    );

    await fetchBalance(address)

    success("Transaction success")
    umTrackEvent('buy-nft', { nftAddress: contractConfig.value.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } catch (e) {
    // TODO: this metod is just temporary, we need to handle the error properly
    error(parseCosmosError(e as Error))
    umTrackEvent('buy-nft-error', { nftAddress: contractConfig.value.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } finally {
    await fetchConfig();
    loading.value = false;
    //emits("update:modelValue", false)
  }
}

async function onSell() {
  loading.value = true;

  try {
    const address = getAddress("bitsong");

    const curveClient = new Bs721CurveClient(
      await useCWClient(),
      address,
      contractConfig.value.marketplaceAddress,
    );

    let burnData = {
      tokenIds: getMaxTokenIds(toValue(amount)),
      // @ts-ignore
      minOutAmount: useToMicroAmount(toValue(yourBid)).toString(),
    }

    const { referral } = useReferral()
    if (referral.value) {
      burnData = {
        ...burnData,
        referral: toValue(referral)
      }
    }

    const tx = await curveClient.burn(burnData,
      "auto",
      "",
      [],
    );

    await fetchBalance(address)

    success("Transaction success")
    umTrackEvent('sell-nft', { nftAddress: contractConfig.value.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } catch (e) {
    error(parseCosmosError(e as Error))
    umTrackEvent('sell-nft-error', { nftAddress: contractConfig.value.nftAddress, amount: toValue(amount), maxBid: toValue(yourBid) })
  } finally {
    await fetchConfig();
    loading.value = false;
    //emits("update:modelValue", false)
  }
}

async function onAllow() {
  loading.value = true;

  try {
    const address = getAddress("bitsong");

    const bs721Client = new Bs721BaseClient(
      await useCWClient(),
      address,
      contractConfig.value.nftAddress,
    );

    const tx = await bs721Client.approveAll(
      {
        operator: contractConfig.value.marketplaceAddress,
      },
      "auto",
      "",
      [],
    );

    await fetchBalance(address)

    success("Transaction success")
    umTrackEvent('allow-sell-nft', { nftAddress: contractConfig.value.nftAddress })
  } catch (e) {
    error((e as Error).message)
    umTrackEvent('allow-sell-nft-error', { nftAddress: contractConfig.value.nftAddress })
  } finally {
    await fetchConfig();
    loading.value = false;
  }
}
</script>

<style lang="css" scoped>
.v-text-field :deep(input) {
  font-size: 1.75rem !important;
  text-align: center;
}
</style>