import type { MaybeRefOrGetter } from '@vueuse/shared'

export interface CurveOptions {
  ratio: MaybeRefOrGetter<number>
  sellerFeeBps: MaybeRefOrGetter<number>
  referralFeeBps: MaybeRefOrGetter<number>
  protocolFeeBps: MaybeRefOrGetter<number>
  totalSupply: MaybeRefOrGetter<number>
}

export function useCurveSimulator(options: MaybeRefOrGetter<CurveOptions>) {
  let _options: CurveOptions

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

  watch(toRef(options), (value) => {
    // TODO: this should work only on client side
    console.log('options changed', value)
    _options = toValue(value)
  }, { immediate: true, deep: true })

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

    if (!toValue(_options)) {
      return response
    }

    const basePrice = computeBasePrice(toValue(_options.ratio), toValue(_options.totalSupply), toValue(amount))
    if (!basePrice || Number.isNaN(basePrice) || basePrice === Infinity) {
      return response
    }

    const creatorFee = useFromBasisPoints(toValue(_options.sellerFeeBps)) / 100 * basePrice
    if (!creatorFee || Number.isNaN(creatorFee) || creatorFee === Infinity) {
      return response
    }

    const referralFee = 0 // TODO: fix it
    const protocolFee = useFromBasisPoints(toValue(_options.protocolFeeBps)) / 100 * basePrice

    const totalPrice = basePrice + creatorFee + referralFee + protocolFee

    console.log('creatofee from buyprice', toValue(_options.sellerFeeBps))

    console.log('ratio from buyprice', toValue(_options.ratio))
    console.log('supply from buyprice', toValue(_options.totalSupply))
    console.log('basePrice', basePrice)
    console.log('newTotalPrice', totalPrice)

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

    if (!toValue(_options)) {
      return response
    }

    const basePrice = computeBasePrice(toValue(_options.ratio), toValue(_options.totalSupply) - toValue(amount), toValue(amount))
    if (!basePrice) {
      return response
    }

    const creatorFee = useFromBasisPoints(toValue(_options.sellerFeeBps)) / 100 * basePrice
    const referralFee = 0 // TODO: fix it
    const protocolFee = useFromBasisPoints(toValue(_options.protocolFeeBps)) / 100 * basePrice

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