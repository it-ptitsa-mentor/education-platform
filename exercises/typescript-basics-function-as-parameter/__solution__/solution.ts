// @ts-check

const filter = (
  numbers: number[],
  predicate: (n: number) => boolean,
): number[] => numbers.filter((n) => predicate(n))

export default filter
