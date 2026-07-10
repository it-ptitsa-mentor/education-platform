// @ts-check

const normalize = (word: string): string => word.split('').sort().join('')

const filterAnagrams = (word: string, candidates: string[]): string[] => {
  const key = normalize(word)
  return candidates.filter((candidate) => normalize(candidate) === key)
}

export default filterAnagrams
