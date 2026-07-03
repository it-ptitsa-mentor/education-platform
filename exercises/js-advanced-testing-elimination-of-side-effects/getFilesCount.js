// Функция, которую нужно протестировать (уже реализована)
import fs from 'node:fs';
import path from 'node:path';

const writeDataToFile = (message) => {
  fs.appendFileSync(path.join(process.cwd(), 'log.txt'), `${message}\n`);
};

const getFilesCount = (dirpath, log = writeDataToFile) => {
  const entries = fs.readdirSync(dirpath, { withFileTypes: true });
  return entries.reduce((acc, entry) => {
    const fullPath = path.join(dirpath, entry.name);
    if (entry.isDirectory()) {
      return acc + getFilesCount(fullPath, log);
    }
    log(`file ${entry.name} has been processed`);
    return acc + 1;
  }, 0);
};

export default getFilesCount;
