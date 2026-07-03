import generator from './passwordGenerator.js';

export default class PasswordGeneratorAdapter {
  generatePassword(length, options) {
    return generator.generate({
      length,
      uppercase: options.includes('uppercase'),
      numbers: options.includes('numbers'),
      symbols: options.includes('symbols'),
    });
  }
}
