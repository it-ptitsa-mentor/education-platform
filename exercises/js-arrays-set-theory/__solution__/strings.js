const countUniqChars = (text) => {
  const seen = [];
  for (const char of text) {
    if (!seen.includes(char)) {
      seen.push(char);
    }
  }
  return seen.length;
};

export default countUniqChars;
