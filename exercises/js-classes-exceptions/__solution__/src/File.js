import fs from 'node:fs';
import NotExistsError from './errors/NotExistsError.js';
import NotReadableError from './errors/NotReadableError.js';

export default class File {
  constructor(filePath) {
    this.filePath = filePath;
  }

  read() {
    if (!fs.existsSync(this.filePath)) {
      throw new NotExistsError(`File '${this.filePath}' does not exist`);
    }
    try {
      fs.accessSync(this.filePath, fs.constants.R_OK);
    } catch {
      throw new NotReadableError(`File '${this.filePath}' is not readable`);
    }
    return fs.readFileSync(this.filePath, 'utf-8');
  }
}
