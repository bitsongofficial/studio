export function useUserBalance() {
  const loading = ref(false);

  const balance = useState<number>("user-balance", () => 0);

  const formattedBalance = computed(() => {
    return `${formatNumber(useFromMicroAmount(balance.value))} BTSG`;
  });

  async function fetchBalance(address: MaybeRefOrGetter<string | undefined>) {
    const _address = toValue(address);
    if (!_address)
      return;

    loading.value = true;

    try {
      const { restAddress } = useRuntimeConfig().public;

      interface Balances {
        balances: { denom: string; amount: string }[];
      }

      const response = await $fetch<Balances>(`${restAddress}/cosmos/bank/v1beta1/balances/${_address}`);
      const ubtsg = response.balances.find(balance => balance.denom === "ubtsg");

      balance.value = ubtsg ? Number.parseInt(ubtsg.amount) : 0;
    }
    catch (e) {
      console.error(e);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    loading,
    balance,
    formattedBalance,
    fetchBalance,
  };
}
