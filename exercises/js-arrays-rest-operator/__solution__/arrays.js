const getMax = (coll) => {
  if (coll.length === 0) {
    return null;
  }
  const [first, ...rest] = coll;
  let max = first;
  for (const item of rest) {
    if (item > max) {
      max = item;
    }
  }
  return max;
};

export { getMax };
export default getMax;
