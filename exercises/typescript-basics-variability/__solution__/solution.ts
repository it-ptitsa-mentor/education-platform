// @ts-check

type Transaction = {
  apply: (amount: number) => number
}

type Wallet = {
  balance: number
  transactions: Transaction[]
}

const applyTransactions = (wallet: Wallet): number => {
  try {
    return wallet.transactions.reduce(
      (amount, transaction) => transaction.apply(amount),
      wallet.balance,
    )
  } catch {
    return wallet.balance
  }
}

export type { Transaction, Wallet }
export default applyTransactions
