// Функция, которую нужно протестировать (уже реализована)
import fs from 'node:fs/promises';

const prettifyHtml = (html) => {
  const match = html.trim().match(/^<(\w+)>(.*)<\/\1>$/s);
  if (!match) {
    return html;
  }
  const [, tag, inner] = match;
  return `<${tag}>\n    ${inner}\n</${tag}>`;
};

const prettifyHTMLFile = async (filepath) => {
  const data = await fs.readFile(filepath, 'utf-8');
  await fs.writeFile(filepath, prettifyHtml(data));
};

export default prettifyHTMLFile;
