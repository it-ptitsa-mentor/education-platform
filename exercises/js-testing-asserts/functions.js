// Реализации функции take() (уже реализованы).
// Ваши тесты запускаются против каждой из них:
// на корректной они должны проходить, на ошибочных — падать
const implementations = {
  correct: (items, n = 1) => (n < 0 ? [] : items.slice(0, n)),
  noDefault: (items, n) => items.slice(0, n),
  brokenNegative: (items, n = 1) => items.slice(0, n),
};

const name = process.env.TAKE_IMPLEMENTATION ?? 'correct';

export default implementations[name];
