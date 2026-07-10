// @ts-check

function last(value: string): string
function last(value: number): number
function last(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.at(-1) ?? ''
  }
  const digits = String(value)
  return Number(digits.at(-1))
}

export default last
