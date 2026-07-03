import get from '../functions.js';

if (get({ hello: 'world' }, 'hello') !== 'world') {
  throw new Error('get() должен возвращать значение по существующему ключу');
}

if (get({}, 'hello', 'kitty') !== 'kitty') {
  throw new Error('get() должен возвращать значение по умолчанию, если ключа нет');
}

if (get({ hello: 'world' }, 'hello', 'kitty') !== 'world') {
  throw new Error('существующий ключ важнее значения по умолчанию');
}
