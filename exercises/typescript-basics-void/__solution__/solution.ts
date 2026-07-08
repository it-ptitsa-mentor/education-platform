export const forEach = <T>(
  arr: T[],
  fn: (item: T) => void
): void => {
  for (const item of arr) {
    fn(item);
  }
};
