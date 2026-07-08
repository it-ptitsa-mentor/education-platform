export const getEvenNumbers = (numbers: number[]): number[] => {
  return numbers.filter((n) => n % 2 === 0);
};
