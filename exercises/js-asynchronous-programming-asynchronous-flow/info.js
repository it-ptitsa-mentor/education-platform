import { compareFileSizes } from './info.js'

compareFileSizes('filepath1', 'filepath2', (_err, result) => console.log(result))