const reverse = (text) => text.split('').reverse().join('');

const convertText = (text) => {
  if (text === '') {
    return '';
  }
  return text[0] === text[0].toUpperCase() ? text : reverse(text);
};

export default convertText;
