import File from './File.js';

export const readFiles = (filePaths) => filePaths.map((filePath) => {
  try {
    return new File(filePath).read();
  } catch {
    return null;
  }
});

export default { readFiles };
