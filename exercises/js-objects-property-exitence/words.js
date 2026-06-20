import countWords from './words.js';

// Если предложение пустое, то возвращается пустой объект 
countWords('');
// {}

const text1 = 'one two three two ONE one wow';
countWords(text1);
// {
//   one: 3,
//   two: 2,
//   three: 1,
//   wow: 1,
// }

const text2 = 'another one sentence with strange Words words';
countWords(text2);
// {
//   another: 1,
//   one: 1,
//   sentence: 1,
//   with: 1,
//   strange: 1,
//   words: 2,
// }