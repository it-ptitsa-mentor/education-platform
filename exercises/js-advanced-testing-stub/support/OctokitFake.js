// Запрос, который выполняет функция getUserMainLanguage
// Именно этот метод нужно будет подменить в фейковом клиенте
const { data } = await client.repos.listForUser({ username })
// data – список репозиториев. У каждого репозитория может быть много полей
// но нас интересует ровно одно – language
// Эти данные нужно подготовить в тестах для фейкового клиента
console.log(data)
// [{ language: 'php', ... }, { language: 'javascript', ... }, ...]