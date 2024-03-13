import { getAddress } from '@quirks/store';
import { isValidAddress } from '@bitsongjs/metadata'

export const useReferral = () => {
  const query = computed(() => useRoute().query.ref as string)
  const _referral = useCookie<string>("referral", {
    sameSite: true,
    expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))
  });

  watchOnce(query, (value) => {
    if (!import.meta.client) return

    if (isValidAddress(value, 'bitsong')) {
      const addr = getAddress('bitsong')
      if (addr !== value) {
        _referral.value = value;
      }
    }
  }, { immediate: true })

  const referral = computed(() => {
    if (!import.meta.client) return

    const addr = getAddress('bitsong')
    if (addr !== _referral.value) {
      return _referral.value
    }
  })

  return { referral }
}