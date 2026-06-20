import extractData from './extractor.js';

const data = extractData(document);
console.log(data);
// {
//   title: 'Category Name',
//   description: 'Category Description',
//   items: [
//     { title: 'Article Name 1', description: 'Article Description 1' },
//     { title: 'Article Name 2', description: 'Article Description 2' }
//   ]
// }