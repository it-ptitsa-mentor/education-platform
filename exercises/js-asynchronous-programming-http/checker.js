import getBadLinks from '../checker.js'

const url = 'https://privet.hexlet'
const links = await getBadLinks(url)
console.log(links)
// Гипотетический пример:
// [
//   'https://privet.hexlet/somepage',
//   'https://privet.hexlet/another/page',
// ]