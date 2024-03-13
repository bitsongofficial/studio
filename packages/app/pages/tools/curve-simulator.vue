<template>
  <app-page>
    <template #title>
      bs721-curve simulator
    </template>
    <template #body>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="2">
            <v-text-field :disabled="data.disabled ? true : false" v-model="ratio" type="number" label="Ratio"
              variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field :disabled="data.disabled ? true : false" v-model="sellerFee" type="number" label="Seller Fee"
              variant="outlined">
              <template #append-inner>
                %
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" v-if="!data.disabled">
            <v-btn @click.stop="onSimulate">Simulate</v-btn>
          </v-col>
          <v-col cols="1" v-if="data.disabled">
            <v-text-field v-model="qty" type="number" label="Qty" variant="outlined"></v-text-field>
          </v-col>
          <v-col cols="auto" v-if="data.disabled">
            <v-btn color="green" @click.stop="onBuy">Buy</v-btn>
          </v-col>
          <v-col cols="auto" v-if="data.disabled">
            <v-btn color="red" @click.stop="onSell">Sell</v-btn>
          </v-col>
          <v-col cols="auto" v-if="data.disabled">
            <v-btn color="surface-variant" variant="text" @click.stop="onReset">Reset</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid v-if="totalVolume > 0">
        <v-row>
          <v-col cols="auto">
            <v-card>
              <v-card-title>Liquidity</v-card-title>
              <v-card-text>{{ formatCoinAmount(useFromMicroAmount(totalLiquidity)) }} BTSG</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-card>
              <v-card-title>Volume</v-card-title>
              <v-card-text>{{ formatCoinAmount(useFromMicroAmount(totalVolume)) }} BTSG</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-card>
              <v-card-title>Royalties</v-card-title>
              <v-card-text>{{ formatCoinAmount(useFromMicroAmount(totalRoyalties)) }} BTSG</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="auto">
            <v-card>
              <v-card-title>Protocol Fee</v-card-title>
              <v-card-text>{{ formatCoinAmount(useFromMicroAmount(totalProtocolFee)) }} BTSG</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row>
          <v-col>
            <v-table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Supply</th>
                  <th>Base Price</th>
                  <th>Creator Fee</th>
                  <th>Protocol Fee</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="result in results">
                  <td>{{ result.action }}</td>
                  <td>{{ result.supply }}</td>
                  <td>{{ formatCoinAmount(useFromMicroAmount(result.basePrice)) }} BTSG</td>
                  <td>{{ formatCoinAmount(useFromMicroAmount(result.creatorFee)) }} BTSG</td>
                  <td>{{ formatCoinAmount(useFromMicroAmount(result.protocolFee)) }} BTSG</td>
                  <td>{{ formatCoinAmount(useFromMicroAmount(result.totalPrice)) }} BTSG</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
const data = reactive({
  disabled: 0,
  ratio: 50,
  sellerFee: 500,
  referralFee: 0,
  protocolFee: 30,
  totalSupply: 0,
})

const qty = ref(1)
const totalLiquidity = ref(0)
const totalVolume = ref(0)
const totalRoyalties = ref(0)
const totalProtocolFee = ref(0)

function onSimulate() {
  data.disabled = 1
}

const ratio = computed({
  get() {
    return data.ratio
  },
  set(value) {
    let ratio
    if (value > 0) {
      ratio = value
    } else {
      ratio = 1
    }

    data.ratio = ratio
  }
})

const sellerFee = computed({
  get() {
    return data.sellerFee / 100
  },
  set(value) {
    let sellerFee
    if (value > 0) {
      sellerFee = value
    } else {
      sellerFee = 0.01
    }

    data.sellerFee = sellerFee * 100
  }
})

interface ItemResult {
  action: "buy" | "sell";
  supply: number;
  basePrice: number;
  creatorFee: number;
  referralFee: number;
  protocolFee: number;
  totalPrice: number;
}

const results = ref<ItemResult[]>([])

function onBuy() {
  const quantity = Number(toValue(qty.value))
  for (let i = 1; i <= quantity; i++) {
    const { basePrice, creatorFee, protocolFee, referralFee, totalPrice } = buyPrice(BigInt(1))
    data.totalSupply += 1

    results.value.unshift({
      action: "buy",
      supply: data.totalSupply,
      basePrice: basePrice,
      creatorFee: creatorFee,
      referralFee: referralFee,
      protocolFee: protocolFee,
      totalPrice: totalPrice,
    })

    totalVolume.value = totalVolume.value + totalPrice
    totalRoyalties.value = totalRoyalties.value + creatorFee
    totalProtocolFee.value = totalProtocolFee.value + protocolFee
    totalLiquidity.value = totalLiquidity.value + basePrice
  }
}

function onSell() {
  if (data.totalSupply < Number(toValue(qty.value))) {
    return
  }

  const quantity = Number(toValue(qty.value))
  // const { basePrice, creatorFee, protocolFee, referralFee, totalPrice } = sellPrice(BigInt(quantity))

  // data.totalSupply -= quantity

  // results.value.unshift({
  //   action: "sell",
  //   supply: data.totalSupply,
  //   basePrice: basePrice,
  //   creatorFee: creatorFee,
  //   referralFee: referralFee,
  //   protocolFee: protocolFee,
  //   totalPrice: totalPrice,
  // })

  // totalVolume.value = totalVolume.value + totalPrice
  // totalRoyalties.value = totalRoyalties.value + creatorFee
  // totalProtocolFee.value = totalProtocolFee.value + protocolFee
  // totalLiquidity.value = totalLiquidity.value - basePrice

  for (let i = 1; i <= quantity; i++) {
    const { basePrice, creatorFee, protocolFee, referralFee, totalPrice } = sellPrice(BigInt(1))

    data.totalSupply -= 1

    results.value.unshift({
      action: "sell",
      supply: data.totalSupply,
      basePrice: basePrice,
      creatorFee: creatorFee,
      referralFee: referralFee,
      protocolFee: protocolFee,
      totalPrice: totalPrice,
    })

    totalVolume.value = totalVolume.value + totalPrice
    totalRoyalties.value = totalRoyalties.value + creatorFee
    totalProtocolFee.value = totalProtocolFee.value + protocolFee
    totalLiquidity.value = totalLiquidity.value - basePrice
  }
}

function onReset() {
  data.disabled = 0
  data.ratio = 50
  data.sellerFee = 100
  data.referralFee = 0
  data.protocolFee = 0.3
  data.totalSupply = 0
  totalVolume.value = 0
  totalRoyalties.value = 0
  totalProtocolFee.value = 0
  totalLiquidity.value = 0
  results.value = []
}

function sumOfSquares(n: bigint): bigint {
  if (n === BigInt(0)) {
    return BigInt(0);
  } else {
    return n * (n + BigInt(1)) * (BigInt(2) * n + BigInt(1)) / BigInt(6);
  }
}

function computeBasePrice(ratio: bigint, supply: bigint, amount: bigint): bigint {
  const sum1 = sumOfSquares(supply);
  const sum2 = sumOfSquares(supply + amount);

  return (sum2 - sum1) * BigInt(1_000_000) / ratio;
}

function buyPrice(amount: bigint) {
  const basePrice = Number(computeBasePrice(BigInt(data.ratio), BigInt(data.totalSupply), amount))
  const creatorFee = data.sellerFee / 10000 * Number(basePrice)
  const referralFee = 0
  const protocolFee = data.protocolFee / 10000 * Number(basePrice)

  const totalPrice = Number(basePrice) + creatorFee + referralFee + protocolFee

  return {
    basePrice,
    creatorFee,
    referralFee,
    protocolFee,
    totalPrice,
  }
}

function sellPrice(amount: bigint) {
  const basePrice = Number(computeBasePrice(BigInt(data.ratio), BigInt(data.totalSupply - Number(amount)), amount))
  const creatorFee = data.sellerFee / 10000 * Number(basePrice)
  const referralFee = 0
  const protocolFee = data.protocolFee / 10000 * Number(basePrice)

  const totalPrice = Number(basePrice) - creatorFee - referralFee - protocolFee

  return {
    basePrice,
    creatorFee,
    referralFee,
    protocolFee,
    totalPrice,
  }
}
</script>