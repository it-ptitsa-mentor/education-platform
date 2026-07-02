const bubbleSort = (coll) => {
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i + 1 < coll.length; i += 1) {
      if (coll[i] > coll[i + 1]) {
        const temp = coll[i];
        coll[i] = coll[i + 1];
        coll[i + 1] = temp;
        swapped = true;
      }
    }
  }
  return coll;
};

export default bubbleSort;
