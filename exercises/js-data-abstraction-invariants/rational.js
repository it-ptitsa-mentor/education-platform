// Вспомогательные функции (уже реализованы)

// Наибольший общий делитель двух чисел
export const getGcd = (a, b) => (b === 0 ? Math.abs(a) : getGcd(b, a % b));

// Строковое представление дроби (используется для отладки)
export const ratToString = (rat) => `${getNumer(rat)}/${getDenom(rat)}`;

// Реализуйте и экспортируйте функции makeRational(numer, denom),
// getNumer(rat), getDenom(rat), add(rat1, rat2) и sub(rat1, rat2)
