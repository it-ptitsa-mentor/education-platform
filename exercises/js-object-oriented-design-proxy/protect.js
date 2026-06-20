import protect from '../protect.js';

const user = {
  name: 'John',
  age: 25,
  password: 'secret',
};

const protectedProps = ['password'];

const protectedUser = protect(user, protectedProps);
protectedUser.name; // John
protectedUser.age; // 25
protectedUser.password; // Error: Access to 'password' is restricted

protectedUser.name = 'Jane'; // установит значение 'Jane' в свойство 'name'
protectedUser.password = 'newPassword'; // Error: Access to 'password' is restricted