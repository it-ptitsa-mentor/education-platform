// @ts-check

function newYearCongratulate(name: string): string
function newYearCongratulate(year: number, name: string): string
function newYearCongratulate(arg1: string | number, arg2?: string): string {
  if (typeof arg1 === 'number') {
    return `Hi ${arg2}! Happy New Year ${arg1}!`
  }
  return `Hi ${arg1}! Happy New Year!`
}

export default newYearCongratulate
