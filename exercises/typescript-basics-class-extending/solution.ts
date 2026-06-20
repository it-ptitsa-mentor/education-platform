import { NotFoundError } from './errors';

const error = new NotFoundError('Not Found');
console.log(error.status); // 404
console.log(error.message); // Not Found