const pick = (data, keys) => {
  const result = {};
  for (const key of keys) {
    if (Object.hasOwn(data, key)) {
      result[key] = data[key];
    }
  }
  return result;
};

export default pick;
