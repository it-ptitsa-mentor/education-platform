const get = (data, keys) => {
  let current = data;
  for (const key of keys) {
    if (
      typeof current !== 'object' ||
      current === null ||
      !Object.hasOwn(current, key)
    ) {
      return null;
    }
    current = current[key];
  }
  return current;
};

export default get;
