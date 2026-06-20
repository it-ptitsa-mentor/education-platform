import { getDirectorySize } from './info.js'

getDirectorySize('/usr/local/bin', (err, size) => {
  console.log(size)
})

// Ошибка
getDirectorySize('/undefined', (err, size) => {
  console.error(err)
})