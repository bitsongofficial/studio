import BigNumber from "bignumber.js";

export function useFromNumberToBN(value: number): BigNumber {
  if (Number.isNaN(value)) {
    //throw new Error("Cannot convert NaN to BN");
    return new BigNumber(0);
  }

  return new BigNumber(value);
}

export function useFromBasisPoints(bps: number): number {
  return useFromNumberToBN(bps).dividedBy(useFromNumberToBN(100)).toNumber();
}

export function useFromMicroAmount(amount: number): number {
  return useFromNumberToBN(amount)
    .integerValue(BigNumber.ROUND_DOWN)
    .dividedBy(useFromNumberToBN(10).pow(6))
    .decimalPlaces(6)
    .toNumber();
}

export function useToMicroAmount(amount: number): number {
  return useFromNumberToBN(amount)
    .multipliedBy(useFromNumberToBN(10).pow(6))
    .integerValue(BigNumber.ROUND_DOWN)
    .toNumber();
}