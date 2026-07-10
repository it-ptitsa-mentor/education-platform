// @ts-check

const lastIndex = (str: string, char: string): number | null => {
  const index = str.lastIndexOf(char)
  return index === -1 ? null : index
}

export default lastIndex
