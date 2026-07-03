// Реализации функции get() (уже реализованы).
// Ваши тесты запускаются против каждой из них:
// на корректной они должны проходить, на ошибочных — падать
const implementations = {
  correct: (obj, key, defaultValue) => (
    Object.hasOwn(obj, key) ? obj[key] : defaultValue
  ),
  alwaysDefault: (obj, key, defaultValue) => defaultValue,
  ignoreDefault: (obj, key) => obj[key],
};

const name = process.env.GET_IMPLEMENTATION ?? 'correct';

export default implementations[name];
