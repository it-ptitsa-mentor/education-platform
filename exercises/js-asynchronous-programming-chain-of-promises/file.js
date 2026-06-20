import { getTypes } from './file.js'

getTypes(['/etc', '/etc/hosts', '/undefined']).then(console.log)
// ['directory', 'file', null]