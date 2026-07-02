const mySubstr = (text, length) => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result = `${result}${text[i]}`;
  }
  return result;
};

export default mySubstr;
