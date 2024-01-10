<template>
  <app-page>
    <template #title>
      Send
    </template>
    <template #body>
      <v-btn @click.stop="sendAll">Send all</v-btn>
    </template>
  </app-page>
</template>

<script lang="ts" setup>
import { contracts, cosmwasm, getSigningCosmwasmClientOptions } from "@bitsongjs/telescope";
import { toUtf8 } from "@cosmjs/encoding";
import { GasPrice, defaultRegistryTypes } from "@cosmjs/stargate";
import {
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
const { Bs721BaseQueryClient, Bs721BaseClient } = contracts.Bs721Base;
import votes from '~/data/votes.json'
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

const { MsgExecuteContract } = cosmwasm.wasm.v1

async function cwClient(): Promise<SigningCosmWasmClient> {
  const { registry, aminoTypes } = getSigningCosmwasmClientOptions({
    defaultTypes: defaultRegistryTypes,
  });

  const offlineSigner = await (await import("@quirks/store")).getOfflineSigner("bwasmnet-1");

  return await SigningCosmWasmClient.connectWithSigner(
    "https://rpc.bwasmnet-1.bitsong.network",
    offlineSigner,
    {
      registry,
      aminoTypes,
    },
  );
}

async function sendAll() {
  const voters = votes.votes.slice(0, 50).map((v) => v.voter)
  const address = getAddress("bitsong");

  let msgs = []
  let token_id = 27 // 

  for (const voter of voters) {
    const msg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: address,
        contract: "bitsong1c7xlpdktxhwh3w4fkzu38fhw5x069ayqwm3v3getjnel9grd9e9qwk9nuz",
        msg: toUtf8(
          JSON.stringify({
            transfer_nft: {
              recipient: voter,
              token_id: token_id.toString(),
            },
          }),
        )
      }),
    }
    msgs.push(msg)
    token_id++
  }

  const client = await cwClient()
  const gas = await client.simulate(address, msgs, "")

  const txRaw = await client.sign(
    address,
    msgs,
    {
      amount: [
        {
          denom: "ubtsg",
          amount: "10000",
        },
      ],
      gas: (gas * 1.3).toFixed(0),
    },
    ""
  )

  const txBytes = TxRaw.encode(txRaw).finish();
  const txRes = await client.broadcastTx(txBytes)
  console.log(txRes.code)
  console.log(txRes.transactionHash)
}
</script>