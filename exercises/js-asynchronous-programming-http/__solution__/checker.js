import extractLinks from './extractLinks.js';

const isAvailable = async (link) => {
  try {
    const response = await fetch(link);
    return response.ok;
  } catch {
    return false;
  }
};

const getBadLinks = async (url) => {
  const response = await fetch(url);
  const content = await response.text();
  const links = extractLinks(content);
  const results = await Promise.all(
    links.map(async (link) => ((await isAvailable(link)) ? null : link)),
  );
  return results.filter((link) => link !== null);
};

export default getBadLinks;
