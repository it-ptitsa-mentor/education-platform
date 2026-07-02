const getIntersectionOfSortedArrays = (first, second) => {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < first.length && j < second.length) {
    if (first[i] === second[j]) {
      if (result[result.length - 1] !== first[i]) {
        result.push(first[i]);
      }
      i += 1;
      j += 1;
    } else if (first[i] > second[j]) {
      j += 1;
    } else {
      i += 1;
    }
  }
  return result;
};

export default getIntersectionOfSortedArrays;
