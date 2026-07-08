export const isPlainObject = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
