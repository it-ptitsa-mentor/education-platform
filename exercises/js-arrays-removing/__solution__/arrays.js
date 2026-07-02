const getSameParity = (coll) => {
  const result = [];
  if (coll.length === 0) {
    return result;
  }
  const parity = Math.abs(coll[0] % 2);
  for (const item of coll) {
    if (Math.abs(item % 2) === parity) {
      result.push(item);
    }
  }
  return result;
};

export default getSameParity;
