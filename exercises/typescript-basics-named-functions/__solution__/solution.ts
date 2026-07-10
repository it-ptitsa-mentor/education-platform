function getHiddenCard(cardNumber: string, hiddenLength = 4): string {
  const lastFour = cardNumber.slice(-4)
  return `${'*'.repeat(hiddenLength)}${lastFour}`
}

export default getHiddenCard
