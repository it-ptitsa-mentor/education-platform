// Функции для создания узлов дерева (уже реализованы)
export const mkfile = (name, meta = {}) => ({ name, meta, type: 'file' });
export const mkdir = (name, children = [], meta = {}) => ({
  name,
  children,
  meta,
  type: 'directory',
});

// Реализуйте функцию, создающую файловую систему из условия,
// и экспортируйте её по умолчанию
