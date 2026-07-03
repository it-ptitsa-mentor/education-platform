import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export const getDirectorySize = async (dirpath) => {
  const names = await readdir(dirpath);
  const stats = await Promise.all(
    names.map((name) => stat(path.join(dirpath, name))),
  );
  return stats
    .filter((stats1) => stats1.isFile())
    .reduce((acc, { size }) => acc + size, 0);
};
