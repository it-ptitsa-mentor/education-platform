import { readFile } from 'node:fs/promises';

const print = async (filepath) => {
  const data = await readFile(filepath, 'utf-8');
  console.log(data);
};

export default print;
