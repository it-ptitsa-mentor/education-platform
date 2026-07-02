const calculateSum = (coll) => {
  let sum = 0;
  for (const item of coll) {
    if (item % 3 === 0) {
      sum += item;
    }
  }
  return sum;
};

export default calculateSum;
