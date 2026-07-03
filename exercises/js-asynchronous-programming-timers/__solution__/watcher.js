import fs from 'node:fs';

const watch = (filepath, period, callback) => {
  let lastCheck = Date.now();
  const id = setInterval(() => {
    fs.stat(filepath, (err, stats) => {
      if (err) {
        clearInterval(id);
        callback(err);
        return;
      }
      if (stats.mtimeMs > lastCheck) {
        lastCheck = Date.now();
        callback();
      }
    });
  }, period);
  return id;
};

export default watch;
