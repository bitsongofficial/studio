<template>
  <v-card>
    <v-table hover>
      <thead>
        <tr>
          <th>Asset</th>
          <th class="text-right">Balance</th>
          <th class="text-right">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="balance in  balanceList " :key="balance.denom">
          <td class="py-4">
            <div class="d-flex align-center">
              <v-avatar size="42" class="mr-4">
                <v-img :src="balance.image"></v-img>
              </v-avatar>
              <div>
                <div class="text-subtitle-1">{{ balance.symbol }}</div>
                <div class="text-subtitle-2 text-surface-variant">{{ balance.name }}</div>
              </div>
            </div>
          </td>
          <td class="text-right">
            <div class="text-subtitle-1">{{ formatCoinAmount(balance.amount) }}</div>
            <div class="text-subtitle-2 text-surface-variant">{{ formatCurrency2Dec(balance.value) }}
            </div>
          </td>
          <td class="text-right text-body-1 text-surface-variant">{{ formatCurrency(balance.price) }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>


<script lang="ts" setup>
import { bitsongAssetList } from "@nabla-studio/chain-registry";

interface Coin {
  denom: string;
  amount: string;
}

const assets = computed(() => {
  return bitsongAssetList.assets;
});

const address = getAddress("bitsong");

interface Balance {
  name?: string;
  image?: string;
  denom: string;
  symbol?: string;
  amount: number;
  price: number;
  value: number;
}

const balanceList = ref<Balance[]>([]);

const fetchBalances = async () => {
  const res = await $fetch<{ balances: Coin[] }>(`https://lcd.explorebitsong.com/cosmos/bank/v1beta1/balances/${address}?pagination.limit=100`);
  const { bitsong: { usd: price } } = await $fetch<{ [key: string]: { usd: number } }>("https://api.coingecko.com/api/v3/simple/price?ids=bitsong&vs_currencies=usd");

  const balances: Balance[] = assets.value
    .filter((asset) => asset.base !== "ft347B1612A2B7659913679CF6CD45B8B130C50A00")
    .map((asset) => {
      return {
        denom: asset.base,
        amount: 0,
        name: asset.name,
        image: asset.images?.[0].png,
        symbol: asset.symbol,
        price: asset.denom_units[0].denom === "ubtsg" ? price : 0,
        value: 0,
      }
    })

  balanceList.value = balances.map((balance) => {
    const found = res.balances.find((b) => b.denom === balance.denom);
    if (found) {
      balance.amount = Number(Number(found.amount) / 1000000);
      balance.value = balance.amount * balance.price;
    }
    return balance;
  }).sort((a, b) => b.value - a.value);
};

onMounted(async () => {
  await fetchBalances();
});

</script>