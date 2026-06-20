import { touch } from './file.js'

touch('/myfile').then(() => console.log('created!'))

// Повторный вызов успешно завершается
touch('/myfile').then(() => console.log('created!'))