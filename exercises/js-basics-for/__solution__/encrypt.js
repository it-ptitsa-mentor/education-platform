const encrypt = (message) => {
  let result = '';
  for (let i = 0; i + 1 < message.length; i += 2) {
    result = `${result}${message[i + 1]}${message[i]}`;
  }
  if (message.length % 2 !== 0) {
    result = `${result}${message[message.length - 1]}`;
  }
  return result;
};

export default encrypt;
