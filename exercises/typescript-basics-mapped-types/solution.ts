const user = sanitize({
  name: 'John',
  password: '1q2w3e',
  token: 'test',
}, ['password', 'token']); // { name: string }

console.log(user); // => { name: 'John' }