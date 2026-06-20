import { getDirectorySize } from './file.js'

getDirectorySize('/usr/local/bin').then(console.log)