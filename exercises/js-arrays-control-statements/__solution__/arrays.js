const getTotalAmount = (wallet, currency) => {
  let total = 0;
  for (const bill of wallet) {
    if (bill.slice(0, 3) === currency) {
      total += Number(bill.slice(4));
    }
  }
  return total;
};

export default getTotalAmount;
