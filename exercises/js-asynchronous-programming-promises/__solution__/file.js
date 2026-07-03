import { readFile, writeFile } from 'node:fs/promises';

export const reverse = async (filepath) => {
  const data = await readFile(filepath, 'utf-8');
  const reversed = data.split('\n').reverse().join('\n');
  await writeFile(filepath, reversed);
};
