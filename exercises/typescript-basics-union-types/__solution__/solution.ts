export const lastIndex = (str: string, char: string): number | null => {
  const idx = str.lastIndexOf(char);
  return idx === -1 ? null : idx;
};
