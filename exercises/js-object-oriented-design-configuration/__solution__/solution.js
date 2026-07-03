export default class PasswordValidator {
  static defaultOptions = {
    minLength: 8,
    containNumbers: true,
  };

  constructor(options = {}) {
    this.options = { ...PasswordValidator.defaultOptions, ...options };
  }

  validate(password) {
    const errors = {};
    if (password.length < this.options.minLength) {
      errors.minLength = 'too small';
    }
    if (this.options.containNumbers && !/\d/.test(password)) {
      errors.containNumbers = 'should contain at least one number';
    }
    return errors;
  }
}
