const getHiddenCard = (cardNumber, starsCount = 4) => {
  const lastDigits = cardNumber.slice(-4);
  return `${'*'.repeat(starsCount)}${lastDigits}`;
};

export default getHiddenCard;
