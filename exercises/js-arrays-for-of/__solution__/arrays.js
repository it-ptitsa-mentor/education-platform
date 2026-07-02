const calculateAverage = (coll) => {
  if (coll.length === 0) {
    return null;
  }
  let sum = 0;
  for (const item of coll) {
    sum += item;
  }
  return sum / coll.length;
};

export default calculateAverage;
