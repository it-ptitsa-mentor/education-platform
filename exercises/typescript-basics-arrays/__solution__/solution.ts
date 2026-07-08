export const filterAnagrams = (word: string, candidates: string[]): string[] => {
  const sorted = (s: string) => s.toLowerCase().split('').sort().join('');
  const target = sorted(word);
  return candidates.filter((c) => sorted(c) === target);
};
