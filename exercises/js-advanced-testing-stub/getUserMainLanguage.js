// Функция, которую нужно протестировать (уже реализована)
const getUserMainLanguage = async (username, client) => {
  const { data } = await client.repos.listForUser({ username });
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
