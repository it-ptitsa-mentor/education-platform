// Локальная замена пакета generate-password (уже реализована).
// Интерфейс повторяет библиотеку: generate({ length, uppercase, numbers, symbols })
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';

export const generate = (options = {}) => {
  const {
    length = 10,
    uppercase = false,
    numbers = false,
    symbols = false,
  } = options;
  let chars = lowercaseChars;
  if (uppercase) {
    chars += uppercaseChars;
  }
  if (numbers) {
    chars += numberChars;
  }
  if (symbols) {
    chars += symbolChars;
  }
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

export default { generate };
