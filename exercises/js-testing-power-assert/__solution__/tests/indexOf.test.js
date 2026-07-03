import assert from 'node:assert';
import indexOf from '../functions.js';

assert.strictEqual(indexOf([1, 2, 1, 2], 2), 1);
assert.strictEqual(indexOf([1, 2, 1, 2], 2, 2), 3);
assert.strictEqual(indexOf([2, 'one', 'cat', false], 8), -1);
assert.strictEqual(indexOf([], 1), -1);
