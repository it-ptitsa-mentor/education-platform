const wallet: Wallet = {
  transactions: [
    {
      apply: (amount) => amount + 1,
    },
  ],
  balance: 0
}

console.log(applyTransactions(wallet)) // 1