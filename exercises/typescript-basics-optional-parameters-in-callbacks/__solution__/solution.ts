export const map = <T, R>(
  arr: T[],
  fn: (item: T, index?: number) => R
): R[] => {
  return arr.map(fn);
};
