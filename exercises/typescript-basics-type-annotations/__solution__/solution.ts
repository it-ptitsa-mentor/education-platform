export const unique = (arr: (number | string)[]): (number | string)[] => {
  const seen = new Set<number | string>();
  return arr.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};
