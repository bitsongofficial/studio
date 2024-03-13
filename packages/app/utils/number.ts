export const { format: formatNumber } = Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 })
export const { format: formatCoinAmount } = Intl.NumberFormat('en-GB', { maximumFractionDigits: 6 })
export const { format: formatCurrency } = Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 3 })
export const { format: formatCurrency2Dec } = Intl.NumberFormat('en-GB', { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 2 })