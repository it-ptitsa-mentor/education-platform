import extractData from './extractor.js';

const data = extractData(document.documentElement);
console.log(data);
// [
//   'First paragraph'
// ]