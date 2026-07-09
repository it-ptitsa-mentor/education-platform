export const asyncMap = async <T, R>(
  promises: Promise<T>[],
  fn: (value: T, index: number) => R,
): Promise<R[]> => {
  const values = await Promise.all(promises);
  return values.map((value, index) => fn(value, index));
};
