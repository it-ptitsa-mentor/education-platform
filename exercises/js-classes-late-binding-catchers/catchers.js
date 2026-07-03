// Допишите реализацию функций-кетчеров.
// Классы ошибок находятся в каталоге errors

export const anyErrorCatcher = (errorHandler, errorInstance) => (error) => {
  // Верните результат errorHandler(error), если ошибка наследуется
  // от errorInstance, иначе выбросьте её заново
  throw error;
};

export const appErrorCatcher = (errorHandler, errorInstance) => (error) => {
  // Верните результат errorHandler(error), если ошибка наследуется
  // от errorInstance И является ошибкой приложения, иначе выбросьте её заново
  throw error;
};

export const customErrorCatcher = (errorHandler, errorInstance) => (error) => {
  // Верните результат errorHandler(error), если у ошибки есть свойство
  // isCustomError: true и errorInstance не задан, иначе выбросьте её заново
  throw error;
};
