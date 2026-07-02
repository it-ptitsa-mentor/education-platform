const swap = (coll) => {
  if (coll.length < 2) {
    return coll;
  }
  const temp = coll[0];
  coll[0] = coll[coll.length - 1];
  coll[coll.length - 1] = temp;
  return coll;
};

export { swap };
export default swap;
