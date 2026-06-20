const numbers = [1, -5, 2, 3, 4, 133];
filter(numbers, (n) => n > 3); // [4, 133]
filter(numbers, (n) => n % 2 == 0); // [2, 4]