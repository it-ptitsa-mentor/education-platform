// @ts-check

type Point = [number, number, number]

const isTheSamePoint = (a: Point, b: Point): boolean =>
  a.every((value, index) => value === b[index])

export type { Point }
export default isTheSamePoint
