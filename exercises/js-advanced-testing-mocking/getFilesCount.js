// Функция, которую нужно протестировать (уже реализована)
import fs from 'node:fs';
import path from 'node:path';

const writeDataToFile = (message) => {
  fs.appendFileSync(path.join(process.cwd(), 'log.txt'), `${message}\n`);
};

const countFiles = (dirpath) => {
  const entries = fs.readdirSync(dirpath, { withFileTypes: true });
  return entries.reduce((acc, entry) => {
    const fullPath = path.join(dirpath, entry.name);
    return acc + (entry.isDirectory() ? countFiles(fullPath) : 1);
  }, 0);
};

const getFilesCount = (dirpath, log = writeDataToFile) => {
  log('Go!');
  return countFiles(dirpath);
};

export default getFilesCount;
