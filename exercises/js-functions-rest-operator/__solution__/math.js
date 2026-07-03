const average = (...numbers) => {
  if (numbers.length === 0) {
    return null;
  }
  const sum = numbers.reduce((acc, number) => acc + number, 0);
  return sum / numbers.length;
};

export default average;
