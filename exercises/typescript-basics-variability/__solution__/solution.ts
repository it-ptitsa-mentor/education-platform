export interface Transaction {
  apply: (amount: number) => number;
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export const applyTransactions = (wallet: Wallet): number => {
  let amount = wallet.balance;
  for (const tx of wallet.transactions) {
    try {
      amount = tx.apply(amount);
    } catch {
      return wallet.balance;
    }
  }
  return amount;
};
