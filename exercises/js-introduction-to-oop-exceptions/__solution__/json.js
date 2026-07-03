export class ParseError extends Error {}

export const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch {
    throw new ParseError('Invalid JSON string');
  }
};

export default parseJson;
