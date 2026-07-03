// Функция, которую нужно протестировать (уже реализована).
// Ходит в сеть через глобальный fetch — именно его нужно подменить в тестах
const getUserMainLanguage = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await response.json();
  if (data.length === 0) {
    return null;
  }
  const counts = data.reduce(
    (acc, { language }) => ({ ...acc, [language]: (acc[language] ?? 0) + 1 }),
    {},
  );
  return Object.keys(counts)
    .reduce((a, b) => (counts[a] >= counts[b] ? a : b));
};

export default getUserMainLanguage;
