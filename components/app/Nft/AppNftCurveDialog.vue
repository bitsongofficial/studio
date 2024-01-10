<template>
  <v-dialog persistent width="450" :model-value="props.modelValue"
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
              {{ useFromMicroAmount(props.buy_price) }} BTSG
            </div>
            <div class="text-body-2" v-else>
              <span class="text-grey">sell @</span>
              {{ useFromMicroAmount(props.sell_price) }} BTSG
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field label="Amount" type="number" v-model="formData.amount" variant="outlined"
              hide-details></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-if="side === 'buy'" label="Max Bid" type="number" v-model="formData.maxBid" variant="outlined"
              hide-details>
              <template #append-inner>BTSG</template>
            </v-text-field>

            <v-text-field v-else label="Min. Accepted" type="number" v-model="formData.maxBid" variant="outlined"
              hide-details readonly>
              <template #append-inner>BTSG</template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-alert color="red" class="text-body-2">
              BitSong Studio's NFT trading feature, powered by bs721-curve, is in BETA! Despite audits, malfunctions may
              occur, risking fund loss. Users trade at their own risk, acknowledging uncertainties in beta software.
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-btn v-if="side === 'buy'" color="green" block rounded="xl" size="large" @click.stop="onBuy"
              :loading="loading">
              Buy
            </v-btn>
            <v-btn v-else-if="side === 'sell' && formData.isAllowedToSell" color="red" block rounded="xl" size="large"
              @click.stop="onSell" :disabled="!canSell" :loading="loading">
              Sell
            </v-btn>
            <v-btn v-else-if="!formData.isAllowedToSell" variant="text" color="red" block rounded="xl" size="large"
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
  buy_price: number;
  sell_price: number;
}

const props = withDefaults(defineProps<Props>(), {
  buy_price: 0,
  sell_price: 0,
});

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

const formData = reactive({
  amount: 1,
  maxBid: 0,
  tokenIds: [] as string[],
  isAllowedToSell: false,
});

function reset() {
  loading.value = false;
  formData.amount = 1;
  formData.maxBid = 0;
  formData.tokenIds = [];
  formData.isAllowedToSell = false;
}

watch(() => props.modelValue, async (value) => {
  if (!value) {
    reset();
  } else {
    if (props.side === "buy") {
      formData.maxBid = useFromMicroAmount(props.buy_price);
    } else {
      formData.maxBid = useFromMicroAmount(props.sell_price);
    }
    await fetchConfig();
  }
});

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
  formData.tokenIds = tokens;

  const { operators } = await bs721QueryClient.allOperators({
    owner: address,
  });
  formData.isAllowedToSell = operators.some((op) => op.spender === props.marketplaceAddress);
}

const canSell = computed(() => {
  const amt = Number(formData.amount);

  if (amt <= 0) {
    return false;
  }

  if (formData.maxBid === 0) {
    return false;
  }

  return formData.tokenIds.length >= amt;
});

function getMaxTokenIds(amt: number): number[] {
  return toValue(formData.tokenIds)
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

    const tx = await curveClient.mint(
      {
        amount: Number(formData.amount),
        //referral: referralAddress,
      },
      "auto",
      "",
      [{ amount: useToMicroAmount(toValue(formData.maxBid)).toString(), denom: "ubtsg" }],
    );

    success("Transaction success")
  } catch (e) {
    error(e.message)
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
        tokenIds: getMaxTokenIds(Number(formData.amount)),
        // @ts-ignore
        minOutAmount: useToMicroAmount(toValue(formData.maxBid)).toString(),
        //referral: referralAddress,
      },
      "auto",
      "",
      [],
    );

    success("Transaction success")
  } catch (e) {
    error(e.message)
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
  } catch (e) {
    error(e.message)
  } finally {
    await fetchConfig();
    loading.value = false;
  }
}
</script>