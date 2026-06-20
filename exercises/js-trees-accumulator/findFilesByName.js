import * as fsTrees from '@hexlet/immutable-fs-trees';
import findFilesByName from '../findFilesByName.js';

const tree = fsTrees.mkdir('/', [
  fsTrees.mkdir('etc', [
    fsTrees.mkdir('apache'),
    fsTrees.mkdir('nginx', [
      fsTrees.mkfile('nginx.conf', { size: 800 }),
    ]),
    fsTrees.mkdir('consul', [
      fsTrees.mkfile('config.json', { size: 1200 }),
      fsTrees.mkfile('data', { size: 8200 }),
      fsTrees.mkfile('raft', { size: 80 }),
    ]),
  ]),
  fsTrees.mkfile('hosts', { size: 3500 }),
  fsTrees.mkfile('resolve', { size: 1000 }),
]);

findFilesByName(tree, 'co');
// ['/etc/nginx/nginx.conf', '/etc/consul/config.json']