// Извлекает ссылки из html-страницы (уже реализована)
const extractLinks = (content) => [...content.matchAll(/href="([^"]+)"/g)]
  .map(([, link]) => link);

export default extractLinks;
