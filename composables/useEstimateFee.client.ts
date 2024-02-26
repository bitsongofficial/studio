import type { EncodeObject } from '@cosmjs/proto-signing';
import type { SignerType } from '@quirks/store';
import { getOfflineSigner, store } from "@quirks/store";
import { assertIsDefined, estimateFee, getEndpoint, getGasPrice } from '@quirks/core';
import type { SigningStargateClientOptions, SignerData, StdFee } from '@cosmjs/stargate';

export const useEstimateFee = async (
  chainName: string,
  messages: EncodeObject[],
  signerType: SignerType = 'auto',
  memo?: string,
): Promise<StdFee> => {
  const state = store.getState();
  assertIsDefined(state.wallet, 'wallet is undefined');

  const chain = state.chains.find((el) => el.chain_name === chainName);
  assertIsDefined(chain);

  const endpoint = getEndpoint(chainName, state.chains);
  const sender = getAddress(chainName);
  const offlineSigner = await getOfflineSigner(chain.chain_id, signerType);

  let clientOptions: SigningStargateClientOptions | undefined = undefined;

  const signingStargate = state.signerOptions?.signingStargate;
  if (signingStargate) {
    clientOptions = await signingStargate(chain);
  }

  const stargate = await import('@cosmjs/stargate');
  const SigningStargateClient =
    stargate.SigningStargateClient ?? stargate.default.SigningStargateClient;

  const client = await SigningStargateClient.connectWithSigner(
    endpoint.rpc.address,
    offlineSigner,
    clientOptions,
  );

  let gasPrice = clientOptions?.gasPrice;

  if (!gasPrice) {
    gasPrice = await getGasPrice(chain);
  }

  return await estimateFee(client, sender, messages, gasPrice, memo);
}