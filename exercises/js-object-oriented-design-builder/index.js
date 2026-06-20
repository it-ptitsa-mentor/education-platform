import getInvalidBooks from './index.js';

const books = [
  { name: 'book', author: 'author' },
  { author: 'author 2' },
];
const invalidBooks = getInvalidBooks(books); // [{ author: 'author 2' }]