const isPrime = (number) => {
  if (number < 2) {
    return false;
  }
  for (let divisor = 2; divisor <= Math.sqrt(number); divisor += 1) {
    if (number % divisor === 0) {
      return false;
    }
  }
  return true;
};

const sayPrimeOrNot = (number) => {
  console.log(isPrime(number) ? 'yes' : 'no');
};

export default sayPrimeOrNot;
