// Функция, которую нужно протестировать (уже реализована).
// Аналог lodash _.set: мутирует объект
const parsePath = (path) => (Array.isArray(path)
  ? path
  : path.replace(/\[(\d+)\]/g, '.$1').split('.'));

const set = (obj, path, value) => {
  const keys = parsePath(path);
  let current = obj;
  keys.slice(0, -1).forEach((key, index) => {
    if (typeof current[key] !== 'object' || current[key] === null) {
      const nextKey = keys[index + 1];
      current[key] = String(Number(nextKey)) === String(nextKey) ? [] : {};
    }
    current = current[key];
  });
  current[keys[keys.length - 1]] = value;
  return obj;
};

export default set;
