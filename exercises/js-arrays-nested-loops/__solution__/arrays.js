const getSameCount = (first, second) => {
  const counted = [];
  let count = 0;
  for (const item of first) {
    if (counted.includes(item)) {
      continue;
    }
    for (const other of second) {
      if (item === other) {
        count += 1;
        counted.push(item);
        break;
      }
    }
  }
  return count;
};

export default getSameCount;
