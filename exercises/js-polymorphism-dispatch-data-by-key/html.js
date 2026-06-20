import getLinks from './html.js';

const tags = [
  { name: 'img', src: 'hexlet.io/assets/logo.png' },
  { name: 'div' },
  { name: 'link', href: 'hexlet.io/assets/style.css' },
  { name: 'h1' },
];

const links = getLinks(tags);
// [
//   'hexlet.io/assets/logo.png',
//   'hexlet.io/assets/style.css'
// ];