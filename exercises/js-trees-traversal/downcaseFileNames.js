import * as fsTrees from '@hexlet/immutable-fs-trees';
import downcaseFileNames from './downcaseFileNames.js';

const tree = fsTrees.mkdir('/', [
  fsTrees.mkdir('eTc', [
    fsTrees.mkdir('NgiNx'),
    fsTrees.mkdir('CONSUL', [
      fsTrees.mkfile('config.json'),
    ]),
  ]),
  fsTrees.mkfile('hOsts'),
]);

downcaseFileNames(tree);
// {
//   name: '/',
//   type: 'directory',
//   meta: {},
//   children: [
//     {
//       name: 'eTc',
//       type: 'directory',
//       meta: {},
//       children: [
//         {
//           name: 'NgiNx',
//           type: 'directory',
//           meta: {},
//           children: [],
//         },
//         {
//           name: 'CONSUL',
//           type: 'directory',
//           meta: {},
//           children: [{ name: 'config.json', type: 'file', meta: {} }],
//         },
//       ],
//     },
//     { name: 'hosts', type: 'file', meta: {}, },
//   ],
// }