export const useIpfsLink = (cid: Ref<string> | string | undefined) => {
  if (!cid) return

  const url = useRuntimeConfig().public.ipfsGateway
  return url.replace('{cid}', toValue(cid));
}