// Функция, которую нужно протестировать (уже реализована)
import fs from 'node:fs';
import path from 'node:path';

const parsers = {
  '.yml': (content) => content
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim()),
  '.json': (content) => JSON.parse(content),
  '.csv': (content) => content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== ''),
};

const toHtmlList = (filepath) => {
  const ext = path.extname(filepath);
  const items = parsers[ext](fs.readFileSync(filepath, 'utf-8'));
  const lines = items.map((item) => `  <li>${item}</li>`).join('\n');
  return `<ul>\n${lines}\n</ul>`;
};

export default toHtmlList;
