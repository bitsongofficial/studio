export const useCloudfront = (link: Ref<string> | string | undefined) => {
  if (!link) return

  const url = useRuntimeConfig().public.cloudfrontUrl
  return `${url}/${toValue(link)}`
}