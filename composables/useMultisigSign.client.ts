import type { StdFee } from '@cosmjs/amino';
import type { EncodeObject } from '@cosmjs/proto-signing';
import type { SignerType } from '@quirks/store';
import type { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { getOfflineSigner, store } from "@quirks/store";
import { assertIsDefined, estimateFee, getEndpoint, getGasPrice } from '@quirks/core';
import type { SigningStargateClientOptions, SignerData } from '@cosmjs/stargate';

export const useMultisigSign = async (
  chainName: string,
  messages: EncodeObject[],
  fee: StdFee | 'auto' = 'auto',
  signerType: SignerType = 'auto',
  memo?: string,
  explicitSignerData?: SignerData | undefined
): Promise<TxRaw> => {
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

  if (fee === 'auto') {
    let gasPrice = clientOptions?.gasPrice;

    if (!gasPrice) {
      gasPrice = await getGasPrice(chain);
    }

    fee = await estimateFee(client, sender, messages, gasPrice, memo);
  }

  //openWCDeeplink(state.wallet, state.openDeeplink);

  return client.sign(sender, messages, fee, memo ?? '', explicitSignerData);
}