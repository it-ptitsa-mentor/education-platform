// @ts-check

const getField = (size: number): (null[])[] =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => null))

export default getField
