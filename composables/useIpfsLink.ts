import { toValue } from "vue"

export const useIpfsLink = (cid: Ref<string> | string | undefined) => {
  if (!cid) return

  const url = useRuntimeConfig().public.ipfsGateway
  if (toValue(cid).startsWith('ipfs://')) {
    const newCid = toValue(cid).replace('ipfs://', '')
    return url.replace('{cid}', toValue(newCid))
  }

  return url.replace('{cid}', toValue(cid));
}