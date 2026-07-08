export const formatPrice = (value?: number | null): string => {
  if (value === null || value === undefined) {
    return '$0.00';
  }
  return '$' + value.toFixed(2);
};
