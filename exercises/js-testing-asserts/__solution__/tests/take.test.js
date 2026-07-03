import assert from 'node:assert';
import take from '../functions.js';

assert.deepStrictEqual(take([], 2), []);
assert.deepStrictEqual(take([1, 2, 3]), [1]);
assert.deepStrictEqual(take([1, 2, 3], 2), [1, 2]);
assert.deepStrictEqual(take([4, 3], 9), [4, 3]);
assert.deepStrictEqual(take([4, 3], -1), []);
