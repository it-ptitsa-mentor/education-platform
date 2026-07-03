import { readFile, writeFile } from 'node:fs/promises';

export const exchange = async (filepath1, filepath2) => {
  const [data1, data2] = await Promise.all([
    readFile(filepath1, 'utf-8'),
    readFile(filepath2, 'utf-8'),
  ]);
  await Promise.all([
    writeFile(filepath1, data2),
    writeFile(filepath2, data1),
  ]);
};
