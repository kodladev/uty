/**
  Benchmark Table
  --------------------------------------------------------------------------------------------------
  Prints the speed table shown in the README of this folder: the pipe from `rivals.js` on five
  items and on ten thousand. Every library is warmed up first, with several different callbacks,
  then they take turns and the order shifts every sample. Each of three rounds gives a median
  per library; the table shows the mean of the three.

    npm run bench:table
  --------------------------------------------------------------------------------------------------
*/

import { big, small } from './data.js';
import { change, keep, others, rivals } from './rivals.js';

const ROUNDS = 3;
const SAMPLES = 40;

/**
 * The libraries, and plain JavaScript once more with its callbacks written where they are used:
 * the one case in which the engine can build a callback into the loop.
 */
const jobs = {
  ...rivals,
  'plain JavaScript, callbacks in place': data =>
    data
      .filter(n => n > 1)
      .map(n => n * 2)
      .reduce((total, number) => total + number, 0),
};
const names = Object.keys(jobs);

/**
 * Times every library on the data, fairly.
 * @param {Array} data - The array given to the pipe.
 * @param {number} repeat - How many calls make one sample, so the clock has something to measure.
 * @returns {Object<string, number>} - Nanoseconds per call, by library.
 */
function measure(data, repeat) {
  for (let i = 0; i < 200; i++) {
    for (const name of names) {
      for (const [a, b] of others) jobs[name](small, a, b);
      jobs[name](data, keep, change);
    }
  }

  const medians = Object.fromEntries(names.map(name => [name, []]));
  for (let round = 0; round < ROUNDS; round++) {
    const times = Object.fromEntries(names.map(name => [name, []]));
    for (let sample = 0; sample < SAMPLES; sample++) {
      // Start one further along each time, so nobody is always first.
      for (let i = 0; i < names.length; i++) {
        const name = names[(i + sample) % names.length];
        const job = jobs[name];
        const start = process.hrtime.bigint();
        for (let call = 0; call < repeat; call++) job(data, keep, change);
        times[name].push(Number(process.hrtime.bigint() - start) / repeat);
      }
    }
    for (const name of names) medians[name].push(times[name].sort((a, b) => a - b)[SAMPLES >> 1]);
  }
  return Object.fromEntries(
    names.map(name => [name, medians[name].reduce((total, time) => total + time, 0) / ROUNDS])
  );
}

const few = measure(small, 20000);
const many = measure(big, 20);

console.log(`mean of ${ROUNDS} medians of ${SAMPLES}\n`);
console.log('| | 5 items (ns) | 10,000 items (µs) |');
console.log('| --- | --: | --: |');
for (const name of names.sort((a, b) => many[a] - many[b])) {
  console.log(`| ${name} | ${few[name].toFixed(0)} | ${(many[name] / 1000).toFixed(0)} |`);
}
