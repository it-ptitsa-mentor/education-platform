// @ts-check

const isPlainObject = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export default isPlainObject
