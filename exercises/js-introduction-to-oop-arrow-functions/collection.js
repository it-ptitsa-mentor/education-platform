import each from './collection.js';

const objects = [
  { name: 'Karl' },
  { name: 'Mia' },
];
each(objects, function callback() {
  this.name = this.name.split('').reverse().join('');
});

console.log(objects);
// [
//   { name: 'lraK' },
//   { name: 'aiM' },
// ];