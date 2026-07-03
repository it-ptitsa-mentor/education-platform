import fs from 'node:fs';

export const move = (src, dest, callback) => {
  fs.readFile(src, (readErr, data) => {
    if (readErr) {
      callback(readErr);
      return;
    }
    fs.writeFile(dest, data, (writeErr) => {
      if (writeErr) {
        callback(writeErr);
        return;
      }
      fs.unlink(src, callback);
    });
  });
};
