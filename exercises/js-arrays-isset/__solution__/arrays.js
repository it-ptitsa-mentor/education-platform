const get = (coll, index, defaultValue = null) => {
  if (index < 0 || index > coll.length - 1) {
    return defaultValue;
  }
  return coll[index];
};

export default get;
