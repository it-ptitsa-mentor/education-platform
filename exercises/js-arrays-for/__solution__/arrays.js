const addPrefix = (coll, prefix) => {
  const result = [];
  for (const item of coll) {
    result.push(`${prefix} ${item}`);
  }
  return result;
};

export default addPrefix;
