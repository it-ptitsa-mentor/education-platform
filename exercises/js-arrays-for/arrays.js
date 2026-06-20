import addPrefix from './arrays.js'

const names = ['john', 'smith', 'karl']

const newNames = addPrefix(names, 'Mr')
console.log(newNames)
// => ['Mr john', 'Mr smith', 'Mr karl'];

console.log(names) // Старый массив не меняется!
// => ['john', 'smith', 'karl'];