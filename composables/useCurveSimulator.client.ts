import type { MaybeRefOrGetter } from '@vueuse/shared'

export interface CurveOptions {
  ratio: number
  sellerFeeBps: number
  referralFeeBps: number
  protocolFeeBps: number
  totalSupply: number
}

export function useCurveSimulator(options: MaybeRefOrGetter<CurveOptions>) {
  const _options = computed(() => {
    let opts = options
    if (typeof opts === 'function') {
      opts = opts()
    }
    return toValue(opts)
  })

  function validateAmount(value: number | string): number {
    const _value = Number(value)

    if (isNaN(_value) || _value < 1) {
      return 1
    }

    if (_value !== Math.floor(_value)) {
      return Math.floor(_value)
    }

    return _value
  }

  const _amount = ref<number>(1)
  const amount = computed({
    get: () => _amount.value,
    set: (value) => {
      _amount.value = validateAmount(value)
    }
  })

  function sumOfSquares(n: number): number {
    if (n === 0) {
      return 0;
    }

    return n * (n + 1) * (2 * n + 1) / 6;
  }

  function computeBasePrice(ratio: number, supply: number, amount: number): number {
    const sum1 = sumOfSquares(supply);
    const sum2 = sumOfSquares(supply + amount);

    return (sum2 - sum1) * 1_000_000 / ratio;
  }

  const buyPrice = computed(() => {
    let response = {
      basePrice: 0,
      creatorFee: 0,
      referralFee: 0,
      protocolFee: 0,
      totalPrice: 0,
      avgPrice: 0
    };

    const basePrice = computeBasePrice(_options.value.ratio, _options.value.totalSupply, toValue(amount))
    if (!basePrice || Number.isNaN(basePrice) || basePrice === Infinity) {
      return response
    }

    const creatorFee = useFromBasisPoints(_options.value.sellerFeeBps) / 100 * basePrice
    if (!creatorFee || Number.isNaN(creatorFee) || creatorFee === Infinity) {
      return response
    }

    const referralFee = 0 // TODO: fix it
    const protocolFee = useFromBasisPoints(_options.value.protocolFeeBps) / 100 * basePrice

    const totalPrice = basePrice + creatorFee + referralFee + protocolFee

    return {
      basePrice: useFromMicroAmount(basePrice),
      creatorFee: useFromMicroAmount(creatorFee),
      referralFee: useFromMicroAmount(referralFee),
      protocolFee: useFromMicroAmount(protocolFee),
      totalPrice: useFromMicroAmount(totalPrice),
      avgPrice: useFromMicroAmount(totalPrice / toValue(amount))
    }
  })

  const sellPrice = computed(() => {
    let response = {
      basePrice: 0,
      creatorFee: 0,
      referralFee: 0,
      protocolFee: 0,
      totalPrice: 0,
      avgPrice: 0
    };

    const basePrice = computeBasePrice(toValue(options).ratio, toValue(toValue(options).totalSupply) - toValue(amount), toValue(amount))
    if (!basePrice) {
      return response
    }

    const creatorFee = useFromBasisPoints(toValue(options).sellerFeeBps) / 100 * basePrice
    const referralFee = 0 // TODO: fix it
    const protocolFee = useFromBasisPoints(toValue(options).protocolFeeBps) / 100 * basePrice

    const totalPrice = basePrice - creatorFee - referralFee - protocolFee

    return {
      basePrice: useFromMicroAmount(basePrice),
      creatorFee: useFromMicroAmount(creatorFee),
      referralFee: useFromMicroAmount(referralFee),
      protocolFee: useFromMicroAmount(protocolFee),
      totalPrice: useFromMicroAmount(totalPrice),
      avgPrice: useFromMicroAmount(totalPrice / toValue(amount))
    }
  })

  return {
    amount,
    buyPrice,
    sellPrice
  }
}