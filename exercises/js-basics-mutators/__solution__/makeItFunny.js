const makeItFunny = (text, n) => {
  let result = '';
  for (let i = 0; i < text.length; i += 1) {
    const char = (i + 1) % n === 0 ? text[i].toUpperCase() : text[i];
    result = `${result}${char}`;
  }
  return result;
};

export default makeItFunny;
