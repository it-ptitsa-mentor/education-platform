const getLetter = (text, position) => {
  const char = text[position - 1];
  return char === undefined || position < 1 ? '' : char;
};

export default getLetter;
