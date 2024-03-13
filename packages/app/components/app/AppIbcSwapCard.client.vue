<template>
  <v-card>
    <v-toolbar color="transparent">
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('update:modelValue', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid class="pt-0 px-0">
      <v-row class="d-flex" no-gutters>
        <v-col>
          <iframe :src="squidUrl" width="100%" height="680px" frameborder="0" scrolling="no"></iframe>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: boolean;
}

defineProps<Props>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

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
