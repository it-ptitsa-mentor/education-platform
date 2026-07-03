// Функция, которую нужно протестировать (уже реализована)
import fs from 'node:fs';

const read = (filepath) => fs.readFileSync(filepath, 'utf-8');

export default read;
