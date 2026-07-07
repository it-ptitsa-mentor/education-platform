export default (doc) => {
  const paragraphs = doc.querySelectorAll('body > p');
  return [...paragraphs].map((p) => p.textContent.trim());
};
