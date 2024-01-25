<template>
  <app-page>
    <template #body>
      <v-container>
        <v-row>
          <v-col>
            <v-btn @click.stop="onCreateRoyalties">Create Royalties</v-btn>
            {{ txRoyalties }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="paymentAddress" label="Payment Address"></v-text-field>
            <v-btn @click.stop="onCreateCurve">Create Curve</v-btn>
            {{ txCurve }}
          </v-col>
        </v-row>
      </v-container>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { contracts } from "@bitsongjs/telescope";

const { Bs721FactoryClient } = contracts.Bs721Factory;

const txRoyalties = ref<any>(null)
const txCurve = ref<any>(null)
const paymentAddress = ref<string>("")

const { success, error } = useNotify()

async function onCreateRoyalties() {
  try {
    const address = getAddress("bitsong");
    const factoryAddress = "bitsong1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqy04vy2";

    const factoryClient = new Bs721FactoryClient(
      await useCWClient(),
      address,
      factoryAddress,
    );

    const tx = await factoryClient.createRoyaltiesGroup(
      {
        denom: "ubtsg",
        contributors: [{ "role": "distributor", "shares": 1000, "address": "bitsong166d42nyufxrh3jps5wx3egdkmvvg7jl6k33yut" }, { "role": "songwriter", "shares": 3000, "address": "bitsong1f5ze3svwg8fgjuwwnr743j6fr9vtyr58nex7tu" }, { "role": "composer", "shares": 3000, "address": "bitsong1gwq49nyq84h4mqs3dm0rgg2pvnl2ec6mtctht7" }, { "role": "arranger", "shares": 3000, "address": "bitsong19k8q2nznqjd92dfgypd5l559yrnu3augfewnwt" }]
      },
      "auto",
      "",
      [],
    );

    success("Transaction success")

    txRoyalties.value = tx
  } catch (e) {
    error((e as Error).message)
  }
}

async function onCreateCurve() {
  try {
    const address = getAddress("bitsong");
    const factoryAddress = "bitsong1wug8sewp6cedgkmrmvhl3lf3tulagm9hnvy8p0rppz9yjw0g4wtqy04vy2";

    const factoryClient = new Bs721FactoryClient(
      await useCWClient(),
      address,
      factoryAddress,
    );

    const tx = await factoryClient.createCurve(
      {
        name: "Ready or Not, Adam Clay",
        ratio: 100,
        symbol: "ACLYREONO",
        uri: "ipfs://QmTcnAjQYi7pR2Gm6SKUHLp5vAsdGkJAT1rcEwsTr9ciot",
        paymentAddress: toValue(paymentAddress.value),
        paymentDenom: "ubtsg",
        sellerFeeBps: 500,
        referralFeeBps: 2000,
        startTime: "1706205600000000000",
      },
      "auto",
      "",
      [{ amount: "500000000", denom: "ubtsg" }],
    );

    success("Transaction success")

    txCurve.value = tx
  } catch (e) {
    error((e as Error).message)
  }
}
</script>