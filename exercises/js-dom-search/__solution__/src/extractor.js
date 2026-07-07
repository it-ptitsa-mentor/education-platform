export default (doc) => {
  const content = doc.querySelector('.content');
  const title = content.querySelector('h1').textContent;
  const description = content.querySelector('.description').textContent;
  const items = [...content.querySelectorAll('.links > div')].map((div) => ({
    title: div.querySelector('h2 a').textContent,
    description: div.querySelector('p').textContent,
  }));
  return { title, description, items };
};
