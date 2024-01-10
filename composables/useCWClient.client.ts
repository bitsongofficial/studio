import { getSigningCosmwasmClientOptions } from "@bitsongjs/telescope";
import { GasPrice, defaultRegistryTypes } from "@cosmjs/stargate";
import {
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

export async function useCWClient(): Promise<SigningCosmWasmClient> {
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
      gasPrice: GasPrice.fromString("1ubtsg"),
    },
  );
}