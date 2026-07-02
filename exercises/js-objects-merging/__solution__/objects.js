const fill = (target, keys, data) => {
  if (keys.length === 0) {
    return Object.assign(target, data);
  }
  const picked = {};
  for (const key of keys) {
    if (Object.hasOwn(data, key)) {
      picked[key] = data[key];
    }
  }
  return Object.assign(target, picked);
};

export default fill;
