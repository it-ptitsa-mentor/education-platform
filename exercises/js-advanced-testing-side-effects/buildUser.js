// Функция, которую нужно протестировать (уже реализована).
// Локальная замена генератора fakerator
const random = (length) => Math.random().toString(36).slice(2, 2 + length);

const buildUser = (params = {}) => ({
  email: `${random(8)}@example.com`,
  firstName: `First-${random(6)}`,
  lastName: `Last-${random(6)}`,
  ...params,
});

export default buildUser;
