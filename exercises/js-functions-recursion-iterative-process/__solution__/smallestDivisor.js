const smallestDivisor = (num) => {
  if (num === 1) {
    return 1;
  }
  const iter = (divisor) => (num % divisor === 0 ? divisor : iter(divisor + 1));
  return iter(2);
};

export default smallestDivisor;
