type Cell = 'x' | 'o' | null;

export const getField = (size: number): Cell[][] => {
  return Array.from({ length: size }, () => Array(size).fill(null));
};
