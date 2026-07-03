// Класс сборки паролей (уже реализован)
import crypto from 'node:crypto';

export default class PasswordBuilder {
  constructor(generator) {
    this.generator = generator;
  }

  buildPassword(length, options) {
    const password = this.generator.generatePassword(length, options);
    const digest = crypto.createHash('sha1').update(password).digest('hex');
    return { password, digest };
  }
}
