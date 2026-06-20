const promisedNumbers = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

asyncMap(promisedNumbers, (num, index) => num * index).then((result) => {
  console.log(result); // [0, 2, 6]
});