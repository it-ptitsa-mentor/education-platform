const countChars = (sentence, char) => {
  const lowerSentence = sentence.toLowerCase();
  const lowerChar = char.toLowerCase();
  let count = 0;
  for (let i = 0; i < lowerSentence.length; i += 1) {
    if (lowerSentence[i] === lowerChar) {
      count += 1;
    }
  }
  return count;
};

export default countChars;
