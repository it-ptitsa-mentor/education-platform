import FileInfo from './FileInfo.js';

export default class SmartFileInfo extends FileInfo {
  getSize(unit = 'b') {
    const size = super.getSize();
    switch (unit) {
      case 'b':
        return size;
      case 'kb':
        return size / 1024;
      default:
        throw new Error(`Unknown unit: '${unit}'`);
    }
  }
}
