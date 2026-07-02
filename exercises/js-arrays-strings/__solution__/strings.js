const makeCensored = (text, stopWords) => {
  const words = text.split(' ');
  const result = [];
  for (const word of words) {
    result.push(stopWords.includes(word) ? '$#%!' : word);
  }
  return result.join(' ');
};

export default makeCensored;
