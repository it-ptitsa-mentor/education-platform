const cloneShallow = (data) => {
  const result = {};
  for (const key of Object.keys(data)) {
    result[key] = data[key];
  }
  return result;
};

export default cloneShallow;
