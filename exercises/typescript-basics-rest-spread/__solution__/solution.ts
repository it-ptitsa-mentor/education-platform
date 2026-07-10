// @ts-check

const max = (first: number, ...rest: number[]): number =>
  rest.reduce((acc, n) => (n > acc ? n : acc), first)

export default max
