<template>
  <v-dialog v-if="!mobile" persistent width="435" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <AppIbcSwapCard v-model="props.modelValue" @update:model-value="$emit('update:modelValue', $event)" />
  </v-dialog>
  <v-bottom-sheet v-else v-model="props.modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <AppIbcSwapCard v-model="props.modelValue" @update:model-value="$emit('update:modelValue', $event)" />
  </v-bottom-sheet>
</template>

<script lang="ts" setup>
import { useDisplay } from 'vuetify';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const loading = ref(false);

function handleClose() {
  emits("update:modelValue", false);
}

const { mobile } = useDisplay()

const config = {
  integratorId: "squid-swap-widget",
  companyName: "Squid",
  style: {
    neutralContent: "#fff",
    baseContent: "#fff",
    base100: "#2a2a2a",
    base200: "#212121",
    base300: "#212121",
    error: "#ED6A5E",
    warning: "#FFB155",
    success: "#2EAEB0",
    primary: "#f40a63",
    secondary: "#F89CC3",
    secondaryContent: "#F7F6FB",
    neutral: "#212121",
    roundedBtn: "26px",
    roundedCornerBtn: "999px",
    roundedBox: "0rem",
    roundedDropDown: "20rem"
  },
  slippage: 1.5,
  infiniteApproval: false,
  enableExpress: true,
  apiUrl: "https://api.squidrouter.com",
  comingSoonChainIds: [],
  titles: {
    swap: "Swap",
    settings: "Settings",
    wallets: "Wallets",
    tokens: "Select Token",
    chains: "Select Chain",
    history: "History",
    transaction: "Transaction",
    allTokens: "Select Token",
    destination: "Destination address"
  },
  priceImpactWarnings: {
    warning: 3,
    critical: 5
  },
  showOnRampLink: true
}

const squidUrl = computed(() => {
  return `https://widget.squidrouter.com/iframe?config=${encodeURIComponent(JSON.stringify(config))}`
})
</script>