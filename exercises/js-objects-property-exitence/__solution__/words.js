const countWords = (sentence) => {
  const result = {};
  if (sentence === '') {
    return result;
  }
  const words = sentence.split(' ').filter((word) => word !== '');
  for (const word of words) {
    const key = word.toLowerCase();
    result[key] = Object.hasOwn(result, key) ? result[key] + 1 : 1;
  }
  return result;
};

export default countWords;
