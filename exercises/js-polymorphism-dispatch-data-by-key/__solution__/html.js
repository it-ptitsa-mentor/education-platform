const attributeByTag = {
  a: 'href',
  link: 'href',
  img: 'src',
};

const getLinks = (tags) => tags
  .filter((tag) => Object.hasOwn(attributeByTag, tag.name))
  .map((tag) => tag[attributeByTag[tag.name]]);

export default getLinks;
