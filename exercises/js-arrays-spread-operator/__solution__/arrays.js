const flatten = (coll) => {
  let result = [];
  for (const item of coll) {
    if (Array.isArray(item)) {
      result = [...result, ...item];
    } else {
      result = [...result, item];
    }
  }
  return result;
};

export { flatten };
export default flatten;
