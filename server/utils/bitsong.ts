import { Secp256k1, Secp256k1Signature, Sha256 } from '@cosmjs/crypto'
import { fromBase64 } from '@cosmjs/encoding'
import { serializeSignDoc, StdSignDoc } from '@cosmjs/amino'

export const makeSignDoc = (address: string, msg: string): StdSignDoc => ({
  chain_id: '',
  account_number: '0',
  sequence: '0',
  fee: {
    gas: '0',
    amount: [],
  },
  msgs: [
    {
      type: 'sign/MsgSignData',
      value: {
        address,
        data: msg,
      },
    },
  ],
  memo: '',
})

interface ParsedMessage {
  appName: string,
  tosLink: string,
  privacyLink: string,
  walletAddress: string,
  domain: string,
  date: Date,
}

function parseRawMessage(rawMsg: string): ParsedMessage | null {
  const regex = /Welcome to (.+)!.*Terms of Service \((.+)\) and Privacy Policy \((.+)\).*Wallet address:\n(.+)\n\nDomain:\n(.+)\n\nDate:\n(.+)/s;
  const match = regex.exec(rawMsg);

  if (match) {
    const appName = match[1];
    const tosLink = match[2];
    const privacyLink = match[3];
    const walletAddress = match[4];
    const domain = match[5];
    const date = match[6];

    return {
      appName,
      tosLink,
      privacyLink,
      walletAddress,
      domain,
      date: new Date(date),
    }
  }

  return null;
}


export async function verifySignature(encodedMsg: string) {
  const { msg, pub_key, signature, address } = JSON.parse(atob(encodedMsg))

  if (!msg || !pub_key || !signature) {
    throw new Error('Invalid payload')
  }

  const parsedMessage = parseRawMessage(msg)
  if (!parsedMessage) {
    throw new Error('Invalid message')
  }

  // TODO: validate domain, date, etc.

  const signDoc = serializeSignDoc(makeSignDoc(address, msg))

  const result = Secp256k1.verifySignature(
    Secp256k1Signature.fromFixedLength(fromBase64(signature)),
    new Sha256(signDoc).digest(),
    fromBase64(pub_key.value)
  )

  if (!result) {
    throw new Error('Signature verification failed')
  }

  return address
}