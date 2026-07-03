import fs from 'node:fs/promises';
import path from 'node:path';

export const getDirectorySize = (dirpath, callback) => {
  fs.readdir(dirpath)
    .then((names) => Promise.all(
      names.map((name) => fs.stat(path.join(dirpath, name))),
    ))
    .then((stats) => {
      const size = stats
        .filter((stats1) => stats1.isFile())
        .reduce((acc, current) => acc + current.size, 0);
      callback(null, size);
    })
    .catch((err) => callback(err));
};
