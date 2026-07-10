// @ts-check

const map = <T, U>(
  items: T[],
  callback: (item: T, index: number) => U,
): U[] => items.map((item, index) => callback(item, index))

export default map
