const reverse = (list) => {
  let prev = null;
  let current = list;
  while (current !== null) {
    const next = current.getNext();
    current.setNext(prev);
    prev = current;
    current = next;
  }
  return prev;
};

export default reverse;
