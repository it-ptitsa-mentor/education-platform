import { fillWithFirst } from './arrays.js'

const numbers1 = [5, 2, 9, 7]
fillWithFirst(numbers1)
console.log(numbers) // => [5, 5, 5, 5])

const numbers2 = [10]
fillWithFirst(numbers2)
console.log(numbers2) // один элемент остаётся как есть
console.log(numbers2) => // [10]

const numbers3 = []
fillWithFirst(numbers3) // пустой массив не меняется
console.log(numbers2) // => []

const words = ['hello', 'world', 'js']
fillWithFirst(words)
console.log(words) // => ['hello', 'hello', 'hello']