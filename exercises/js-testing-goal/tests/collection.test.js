// Идея функции взята из lodash
// https://lodash.com/docs#get
get({ hello: 'world' }, 'hello'); // world
get({ hello: 'world' }, 'hello', 'kitty'); // 'world'
get({}, 'hello', 'kitty'); // 'kitty'