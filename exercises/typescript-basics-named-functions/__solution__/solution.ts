export const getHiddenCard = (cardNumber: string, numStars = 4): string => {
  const visible = cardNumber.slice(-4);
  return '*'.repeat(numStars) + visible;
};
