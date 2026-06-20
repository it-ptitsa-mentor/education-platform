// Создаем объект валидатора
const validator = makeValidator();
// Так как не было добавлено ни одной проверки, любое значение верное
validator.isValid('some value'); // true
// Добавляем в валидатор проверку, что переданное значение больше 5
validator.addCheck((v) => v > 5);
// Добавляем проверку, что переданное значение четное
validator.addCheck((v) => v % 2 === 0);
// Проверяем значения на соответствие всем добавленным проверкам
validator.isValid(3); // false
validator.isValid(4); // false
validator.isValid(7); // false
validator.isValid(8); // true
validator.addCheck(/* add more checks */);