import type { SignerType } from '@quirks/store';
import { getOfflineSigner, store } from "@quirks/store";
import { assertIsDefined, getEndpoint } from '@quirks/core';
import type { SigningStargateClientOptions, SigningStargateClient } from '@cosmjs/stargate';

export const useSigningStargateClient = async (
  chainName: string,
  signerType: SignerType = 'auto',
): Promise<SigningStargateClient> => {
  const state = store.getState();
  assertIsDefined(state.wallet, 'wallet is undefined');

  const chain = state.chains.find((el) => el.chain_name === chainName);
  assertIsDefined(chain);

  const endpoint = getEndpoint(chainName, state.chains);
  const offlineSigner = await getOfflineSigner(chain.chain_id, signerType);

  let clientOptions: SigningStargateClientOptions | undefined = undefined;

  const signingStargate = state.signerOptions?.signingStargate;
  if (signingStargate) {
    clientOptions = await signingStargate(chain);
  }

  const stargate = await import('@cosmjs/stargate');
  const SigningStargateClient =
    stargate.SigningStargateClient ?? stargate.default.SigningStargateClient;

  return await SigningStargateClient.connectWithSigner(
    endpoint.rpc.address,
    offlineSigner,
    clientOptions,
  );
}