const swapKeyValue = (map) => {
  const data = map.toObject();
  Object.entries(data).forEach(([key, value]) => {
    map.unset(key);
    map.set(value, key);
  });
};

export default swapKeyValue;
