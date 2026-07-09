export const last = <T>(arr: T[]): T | null => {
  return arr.length === 0 ? null : arr[arr.length - 1];
};
