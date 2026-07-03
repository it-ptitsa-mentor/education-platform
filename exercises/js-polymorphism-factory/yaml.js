// Локальная замена пакета js-yaml (уже реализована).
// Поддерживает плоские конфигурации вида «ключ: значение».
// Интерфейс повторяет библиотеку: yaml.load(content)
const load = (content) => content
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line !== '' && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...rest] = line.split(':');
    return { ...acc, [key.trim()]: rest.join(':').trim() };
  }, {});

export { load };
export default { load };
