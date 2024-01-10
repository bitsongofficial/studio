import {
  assertIsDefined,
  getEndpoint,
} from '@quirks/core';
import { store } from "@quirks/store";

export const useQueryClient = async (chainName: string) => {
  //const { chains } = useConfig()
  const state = store.getState();

  const chain = getChain(chainName)
  assertIsDefined(chain);

  let endpoint = getEndpoint(chainName, state.chains);

  const { rpcAddress, restAddress } = useRuntimeConfig().public;

  if (chainName === 'bitsong') {
    endpoint = {
      rpc: {
        address: rpcAddress
      },
      rest: {
        address: restAddress,
      },
    }
  }

  const CosmWasmClient = (await import('@cosmjs/cosmwasm-stargate')).CosmWasmClient;
  return CosmWasmClient.connect(endpoint.rpc.address);
}