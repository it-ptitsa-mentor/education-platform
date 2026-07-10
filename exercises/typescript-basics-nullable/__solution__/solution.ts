// @ts-check

const formatPrice = (price?: number | null): string => `$${(price ?? 0).toFixed(2)}`

export default formatPrice
