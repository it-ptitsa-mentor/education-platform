// Реализации функции indexOf() (уже реализованы).
// Ваши тесты запускаются против каждой из них:
// на корректной они должны проходить, на ошибочных — падать
const implementations = {
  correct: (items, value, fromIndex = 0) => items.indexOf(value, fromIndex),
  ignoreFromIndex: (items, value) => items.indexOf(value),
  zeroWhenMissing: (items, value, fromIndex = 0) => {
    const index = items.indexOf(value, fromIndex);
    return index === -1 ? 0 : index;
  },
};

const name = process.env.INDEXOF_IMPLEMENTATION ?? 'correct';

export default implementations[name];
