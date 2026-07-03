// Валидатор, который нужно протестировать (уже реализован)
const makeValidator = () => {
  const checks = [];
  return {
    addCheck(fn) {
      checks.push(fn);
    },
    isValid(value) {
      return checks.every((check) => check(value));
    },
  };
};

export default makeValidator;
