import path from 'path';
import ConfigFactory from '../ConfigFactory.js';

const filePath = path.join(__dirname, '__fixtures__', 'test.yml');
const config = ConfigFactory.factory(filePath);
config.getValue('key'); // value
console.log(config.constructor.name); // Config