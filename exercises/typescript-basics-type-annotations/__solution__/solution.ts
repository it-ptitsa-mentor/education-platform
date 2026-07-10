// @ts-check

const unique = (items: (number | string)[]): (number | string)[] => {
  const seen = new Set<number | string>()
  return items.filter((item) => {
    if (seen.has(item)) {
      return false
    }
    seen.add(item)
    return true
  })
}

export default unique
