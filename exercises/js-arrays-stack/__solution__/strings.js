const isBracketStructureBalanced = (text) => {
  const opening = ['(', '[', '{', '<'];
  const closing = [')', ']', '}', '>'];
  const stack = [];
  for (const char of text) {
    const openIndex = opening.indexOf(char);
    if (openIndex !== -1) {
      stack.push(char);
      continue;
    }
    const closeIndex = closing.indexOf(char);
    if (closeIndex !== -1) {
      if (stack.pop() !== opening[closeIndex]) {
        return false;
      }
    }
  }
  return stack.length === 0;
};

export default isBracketStructureBalanced;
