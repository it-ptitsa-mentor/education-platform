// все вызовы нужно рассматривать, как независимые

const array =  [1, 2, 3, 4];

fill(array, '*', 1, 3);
console.log(array); // => [1, '*', '*', 4]

fill(array, '*');
console.log(array); // => ['*', '*', '*', '*']

fill(array, '*', 4);
console.log(array); // => [1, 2, 3, 4]

fill(array, '*', 0, 10);
console.log(array); // => ['*', '*', '*', '*']