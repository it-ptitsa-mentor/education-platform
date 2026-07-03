import { access, writeFile } from 'node:fs/promises';

export const touch = (filepath) => access(filepath)
  .catch(() => writeFile(filepath, ''));
