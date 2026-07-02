const joinNumbersFromRange = (begin, end) => {
  let result = '';
  for (let i = begin; i <= end; i += 1) {
    result = `${result}${i}`;
  }
  return result;
};

export default joinNumbersFromRange;
