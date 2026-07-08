export const repeat = (str: string, times: number): string => {
  let result = '';
  for (let i = 0; i < times; i++) {
    result += str;
  }
  return result;
};
