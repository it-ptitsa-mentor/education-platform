import { make, set, get } from './map.js';

const map = make();
let result = get(map, 'key');
console.log(result); // => null

result = get(map, 'key', 'default_value');
console.log(result); // => "default_value"

set(map, 'key2', 'value2');
result = get(map, 'key2');
console.log(result); // => "value2"