import { stat } from 'node:fs/promises';

export const getTypes = (paths) => Promise.all(
  paths.map((filepath) => stat(filepath)
    .then((stats) => (stats.isDirectory() ? 'directory' : 'file'))
    .catch(() => null)),
);
