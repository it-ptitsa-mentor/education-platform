const fill = (coll, value, start = 0, end = coll.length) => {
  const finish = Math.min(end, coll.length);
  for (let i = start; i < finish; i += 1) {
    coll[i] = value;
  }
  return coll;
};

export default fill;
