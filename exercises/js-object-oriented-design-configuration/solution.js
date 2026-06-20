const validator = new PasswordValidator({ containNumbers: false });
validator.validate('qwertyui'); // {}
validator.validate('qwerty'); // { minLength: 'too small' }