const takeLast = (text, n) => {
  if (text.length === 0 || text.length < n) {
    return null;
  }
  return text.slice(-n).split('').reverse().join('');
};

const run = (text) => takeLast(text, 4);

export default run;
