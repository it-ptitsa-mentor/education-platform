export const getParams = (query: string): Record<string, string> => {
  const result: Record<string, string> = {};
  if (!query) return result;
  for (const pair of query.split('&')) {
    const [key, value] = pair.split('=');
    result[key] = value;
  }
  return result;
};
