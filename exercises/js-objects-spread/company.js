import make from '../company.js';

// Дополнительные свойства не переданы
const company = make('Hexlet');
// {
//   name: 'Hexlet',
//   state: 'moderating',
//   createdAt: <тут текущая дата>
// }

// Передаем дополнительные свойства
const company = make('Hexlet', { website: 'hexlet.io', state: 'published' });
// {
//   name: 'Hexlet',
//   website: 'hexlet.io',
//   state: 'published',
//   createdAt: <тут текущая дата>
// }