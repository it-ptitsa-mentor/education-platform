export const last = (value: string | number): string | number => {
  if (typeof value === 'string') {
    return value[value.length - 1];
  }
  return Number(String(value)[String(value).length - 1]);
};
