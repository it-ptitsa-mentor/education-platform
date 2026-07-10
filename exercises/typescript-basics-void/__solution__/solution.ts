// @ts-check

const forEach = <T>(
  items: T[],
  callback: (item: T, index: number) => void,
): void => {
  items.forEach((item, index) => {
    callback(item, index)
  })
}

export default forEach
