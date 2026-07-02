const printNumbers = (max) => {
  let i = max;
  while (i >= 1) {
    console.log(i);
    i -= 1;
  }
  console.log('finished!');
};

export default printNumbers;
