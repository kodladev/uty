/**
  Benchmark Handles
  --------------------------------------------------------------------------------------------------
  Speed says nothing when the answer is wrong. This prints what each library's pipe gives when
  the same pipe meets an array, an object, and a Promise of either. The pipe is the one from the
  README: keep what is above one, double it, add it up. The answer is always 10.

    npm run bench:handles                 yes or no for every input
    npm run bench:handles -- --show       what each library answered
  --------------------------------------------------------------------------------------------------
*/

import { change, keep, rivals } from './rivals.js';

/** The inputs: a label and a function that makes a fresh one. */
const inputs = [
  ['an array', () => [1, 2, 3]],
  ['an object', () => ({ a: 1, b: 2, c: 3 })],
  ['a Promise of an array', () => Promise.resolve([1, 2, 3])],
  ['a Promise of an object', () => Promise.resolve({ a: 1, b: 2, c: 3 })],
];

const names = Object.keys(rivals);

/**
 * Runs one library's pipe on one input.
 * @param {string} name - The library.
 * @param {Function} make - Makes the input.
 * @returns {Promise<*>} - The answer, or the word `threw`.
 */
async function answer(name, make) {
  try {
    return await rivals[name](make(), keep, change);
  } catch {
    return 'threw';
  }
}

const show = process.argv.includes('--show');

console.log('the same pipe, given'.padEnd(26) + names.map(name => name.padEnd(18)).join(''));
for (const [label, make] of inputs) {
  let line = label.padEnd(26);
  for (const name of names) {
    const result = await answer(name, make);
    line += (show ? String(result) : result === 10 ? 'yes' : 'no').padEnd(18);
  }
  console.log(line);
}
