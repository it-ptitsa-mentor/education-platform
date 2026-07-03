// Базовый класс (уже реализован)
import fs from 'node:fs';

export default class FileInfo {
  constructor(filePath) {
    this.filePath = filePath;
  }

  getSize() {
    return fs.statSync(this.filePath).size;
  }
}
