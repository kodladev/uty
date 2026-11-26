/**
  Benchmark Compare
  --------------------------------------------------------------------------------------------------
  Tells whether a change made a function faster or slower. It measures the `src` folder as it is
  now against an earlier one, taking turns in a single process, so both meet the same machine
  state and the same garbage collector. Two separate benchmark runs cannot promise that.

    npm run bench:compare              against the last commit
    npm run bench:compare -- v0.3.0    against a tag, a branch or a commit
    npm run bench:compare -- ../old    against a folder that holds a `src`
  --------------------------------------------------------------------------------------------------
*/

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { big, object, other, records, small } from './data.js';

const root = fileURLToPath(new URL('..', import.meta.url));
// The earlier `src` is copied inside the package, so its imports resolve like the current one's.
const copy = join(root, 'bench', '.compare');
const target = process.argv[2] ?? 'HEAD';
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });

rmSync(copy, { recursive: true, force: true });
if (existsSync(join(target, 'src'))) {
  cpSync(join(target, 'src'), join(copy, 'src'), { recursive: true });
} else {
  // Inside a larger repository the package sits under a prefix; `git show` wants the full path.
  const prefix = git('rev-parse', '--show-prefix').trim();
  const files = git('ls-tree', '-r', '--name-only', target, '--', 'src')
    .split('\n')
    .filter(Boolean);
  if (files.length === 0) throw new Error(`no src folder found at "${target}"`);
  for (const file of files) {
    const path = join(copy, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, git('show', `${target}:${prefix}${file}`));
  }
}

/**
 * Loads the modules the cases use from one `src` folder.
 * @param {string} folder - The folder that holds `src`.
 * @returns {Promise<Object>} - Their exports in one object.
 */
async function load(folder) {
  const from = file => import(pathToFileURL(join(folder, 'src', file)));
  return { ...(await from('index.js')), ...(await from('collect.js')), ...(await from('math.js')) };
}

/**
 * The cases: a name, how many calls make one sample, and the call itself.
 * @param {Object} u - The functions of one side.
 * @returns {Array<[string, number, Function]>} - The cases.
 */
function cases(u) {
  const above = n => n > 1;
  const double = n => n * 2;
  const total = u.pipe(u.filter(above), u.map(double), u.sum);
  return [
    ['pipe: filter, map, sum, 5', 20000, () => total(small)],
    ['pipe: filter, map, sum, 10,000', 20, () => total(big)],
    ['pipe: the same, on an object of 100', 2000, () => total(object)],
    ['map, 5', 20000, () => u.map(double, small)],
    ['map, 10,000', 20, () => u.map(double, big)],
    ['filter, keeps all, 10,000', 20, () => u.filter(above, big)],
    ['filter, keeps 1 in 100, 10,000', 20, () => u.filter(n => n % 100 === 0, big)],
    ['filter without a function, 10,000', 20, () => u.filter(big)],
    ['reduce, 10,000', 20, () => u.reduce((a, b) => a + b, 0, big)],
    ['every, 10,000', 20, () => u.every(n => n >= 0, big)],
    ['some, no match, 10,000', 20, () => u.some(n => n < 0, big)],
    ['some, key and value, 1,000 records', 200, () => u.some('id', -1, records)],
    ['pluck, 1,000 records', 200, () => u.pluck('name', records)],
    ['pluck, nested key, 1,000 records', 200, () => u.pluck('detail.date', records)],
    ['sum, by key, 1,000 records', 200, () => u.sum('price', records)],
    ['unique, by function, 1,000 records', 200, () => u.unique(item => item.id, records)],
    ['diff, 10,000 against 1,000', 20, () => u.diff(other, big)],
  ];
}

/**
 * Hands a side several different callbacks, as an application would; a function that has met
 * a single callback is timed in a state no real program keeps it in.
 * @param {Object} u - The functions of one side.
 */
function mix(u) {
  u.map(n => n + 1, small);
  u.map(item => item.id, records);
  u.filter(n => n < 3, small);
  u.filter(item => item.id > 5, records);
  u.reduce((a, b) => a * b, 1, small);
  u.every(item => item.id >= 0, records);
  u.some(item => item.id > 98, records);
  u.unique(item => item.name, records);
  u.pipe(
    small,
    u.map(n => -n),
    u.filter(n => n < 0)
  );
  u.pipe(records, u.pluck('id'), u.sum);
}

const sides = { before: await load(copy), now: await load(root) };
const lists = { before: cases(sides.before), now: cases(sides.now) };
const median = times => times.sort((a, b) => a - b)[times.length >> 1];

/**
 * Formats a time for the table.
 * @param {number} ns - Nanoseconds.
 * @returns {string} - Nanoseconds below a microsecond, microseconds above.
 */
function show(ns) {
  return ns < 1000 ? ns.toFixed(0) + ' ns' : (ns / 1000).toFixed(1) + ' µs';
}

// Warm both up on every case before any timing.
for (let i = 0; i < 300; i++) {
  for (const side of ['before', 'now']) {
    mix(sides[side]);
    for (const [, , call] of lists[side]) call();
  }
}

console.log(`now against ${target}\n`);
console.log('case'.padEnd(38) + 'before'.padStart(11) + 'now'.padStart(11) + 'change'.padStart(9));
for (let index = 0; index < lists.now.length; index++) {
  const [name, repeat] = lists.now[index];
  const times = { before: [], now: [] };
  for (let round = 0; round < 60; round++) {
    // Swap who goes first every round.
    for (const side of round % 2 ? ['before', 'now'] : ['now', 'before']) {
      const call = lists[side][index][2];
      const start = process.hrtime.bigint();
      for (let i = 0; i < repeat; i++) call();
      times[side].push(Number(process.hrtime.bigint() - start) / repeat);
    }
  }
  const a = median(times.before);
  const b = median(times.now);
  const change = ((b / a - 1) * 100).toFixed(0);
  console.log(
    name.padEnd(38) +
      show(a).padStart(11) +
      show(b).padStart(11) +
      ((change > 0 ? '+' : '') + change + '%').padStart(9)
  );
}
console.log('\nA change of a few percent either way is noise; run it again before trusting it.');
