import type { MultisigThresholdPubkey } from "@cosmjs/amino";
import { pubkeyToAddress } from "@cosmjs/amino";
import { Uint53 } from "@cosmjs/math";
import type { EncodeObject } from '@cosmjs/proto-signing';
import type { SigningStargateClientOptions, StdFee } from '@cosmjs/stargate';
import { makeMultisignedTxBytes } from "@cosmjs/stargate";
import { TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { assertIsDefined, getEndpoint, getGasPrice } from '@quirks/core';
import type { SignerType } from '@quirks/store';
import { getOfflineSigner, store } from "@quirks/store";

export const useEstimateFee = async (
  chainName: string,
  sender: string,
  messages: EncodeObject[],
  signerType: SignerType = 'auto',
  memo?: string,
  multiplier = 1.4
): Promise<StdFee> => {
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

  const client = await SigningStargateClient.connectWithSigner(
    endpoint.rpc.address,
    offlineSigner,
    clientOptions,
  );

  const pubkey = {
    "type": "tendermint/PubKeyMultisigThreshold",
    "value": {
      "threshold": "2",
      "pubkeys": [
        {
          "type": "tendermint/PubKeySecp256k1",
          "value": "AsZTx9Fle5IB5cm38ZLmfymPVYNiEDIRot9LWLcVpEMT"
        },
        {
          "type": "tendermint/PubKeySecp256k1",
          "value": "AkcSrZv9sD5RVdc5Fa7R7ySo2R9bYYw3fCNGlMmgsaMJ"
        },
        {
          "type": "tendermint/PubKeySecp256k1",
          "value": "AiK1mxVD+oSvb0DMj2HKADBZFtyj6eCQ1D3vKqgdYCsK"
        }
      ]
    }
  } as MultisigThresholdPubkey;

  const { sequence } = await client.getSequence(sender);

  const msgs = TxBody.encode(TxBody.fromPartial({
    messages: messages.map((msg) => client.registry.encodeAsAny(msg)),
    memo: memo,
  })).finish()

  const signatures = new Map<string, Uint8Array>(
    pubkey.value.pubkeys.map((pk) => [
      pubkeyToAddress(pk, "bitsong"),
      new Uint8Array(64),
    ])
  )

  const fee: StdFee = {
    amount: [{ denom: "ubtsg", amount: "0" }],
    gas: "0",
  }

  const { ClientFactory } = (await import("@bitsongjs/telescope")).cosmos
  const qc = await ClientFactory.createRPCQueryClient({ rpcEndpoint: endpoint.rpc.address })
  const { gasInfo } = await qc.cosmos.tx.v1beta1.simulate({
    txBytes: makeMultisignedTxBytes(pubkey, sequence, fee, msgs, signatures)
  })

  if (!gasInfo) {
    throw new Error('Gas estimation failed');
  }

  const gasEstimation = Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();

  let gasPrice = clientOptions?.gasPrice;

  if (!gasPrice) {
    gasPrice = await getGasPrice(chain);
  }

  const calculateFee = stargate.calculateFee ?? stargate.default.calculateFee;
  return calculateFee(Math.round(gasEstimation * multiplier), gasPrice ?? "");
}