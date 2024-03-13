import { getSigningCosmwasmClientOptions } from "@bitsongjs/telescope";
import { GasPrice, defaultRegistryTypes } from "@cosmjs/stargate";
import {
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

export async function useCWClient(): Promise<SigningCosmWasmClient> {
  const { registry, aminoTypes } = getSigningCosmwasmClientOptions({
    defaultTypes: defaultRegistryTypes,
  });

  const { rpcAddress, chainId } = useRuntimeConfig().public;
  const offlineSigner = await (await import("@quirks/store")).getOfflineSigner(chainId);

  return await SigningCosmWasmClient.connectWithSigner(
    rpcAddress,
    offlineSigner,
    {
      registry,
      aminoTypes,
      gasPrice: GasPrice.fromString("0.025ubtsg"),
    },
  );
}