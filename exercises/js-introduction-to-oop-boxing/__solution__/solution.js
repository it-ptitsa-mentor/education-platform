const wrap = (value) => ({
  toString() {
    return `Value is ${value}`;
  },
});

export default wrap;
