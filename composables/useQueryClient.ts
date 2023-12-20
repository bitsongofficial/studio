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

  if (chainName === 'bitsong') {
    endpoint = {
      rpc: {
        address: 'https://rpc.explorebitsong.com',
      },
      rest: {
        address: 'https://lcd.explorebitsong.com',
      },
    }
  }

  const CosmWasmClient = (await import('@cosmjs/cosmwasm-stargate')).CosmWasmClient;
  return CosmWasmClient.connect(endpoint.rpc.address);
}