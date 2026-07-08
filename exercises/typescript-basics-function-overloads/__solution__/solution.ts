export function newYearCongratulate(name: string): string;
export function newYearCongratulate(year: number, name: string): string;
export function newYearCongratulate(yearOrName: string | number, name?: string): string {
  if (typeof yearOrName === 'string') {
    return `Hi ${yearOrName}! Happy New Year!`;
  }
  return `Hi ${name}! Happy New Year ${yearOrName}!`;
}
