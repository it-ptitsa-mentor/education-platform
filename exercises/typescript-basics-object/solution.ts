const user = {
  name: 'Tirion',
  email: 'tirion@lanister.got',
  age: 35,
};

removeKeys(user, ['email', 'age']); // { name: 'Tirion' }