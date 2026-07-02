const getSuperSeriesWinner = (scores) => {
  let balance = 0;
  for (const [canada, ussr] of scores) {
    balance += Math.sign(canada - ussr);
  }
  if (balance === 0) {
    return null;
  }
  return balance > 0 ? 'canada' : 'ussr';
};

export default getSuperSeriesWinner;
