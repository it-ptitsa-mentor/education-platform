import fs from 'node:fs';

export const compareFileSizes = (filepath1, filepath2, callback) => {
  fs.stat(filepath1, (err1, stats1) => {
    if (err1) {
      callback(err1);
      return;
    }
    fs.stat(filepath2, (err2, stats2) => {
      if (err2) {
        callback(err2);
        return;
      }
      callback(null, Math.sign(stats1.size - stats2.size));
    });
  });
};
