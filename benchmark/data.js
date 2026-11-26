/**
  Benchmark Data
  --------------------------------------------------------------------------------------------------
  Shared inputs for the benchmarks. Every case measures a uty function next to the plain
  JavaScript that does the same job, so the numbers show the cost of the abstraction.
  --------------------------------------------------------------------------------------------------
*/

/** Options shared by every case: a short sampling window keeps the whole run under a minute. */
export const options = { time: 200 };

/** Five numbers: the fixed cost per call dominates here. */
export const small = [1, 2, 3, 4, 5];

/** Ten thousand distinct numbers: the cost per element dominates here. */
export const big = Array.from({ length: 10000 }, (_, i) => i);

/** One thousand numbers, half of them shared with `big`'s first thousand. */
export const other = Array.from({ length: 1000 }, (_, i) => i * 2);

/** One thousand records with a repeating id and a nested field. */
export const records = Array.from({ length: 1000 }, (_, i) => ({
  id: i % 100,
  name: `name-${i}`,
  price: i * 1.5,
  detail: { date: 1900 + (i % 100), tags: ['a', 'b'] },
}));

/** A plain object with one hundred numeric values. */
export const object = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]));

/** A nested configuration object, and the overrides merged into it. */
export const config = { a: 1, b: { c: 2, d: { e: 3, f: [1, 2] } }, g: 'x' };
export const overrides = { b: { d: { e: 4 }, h: 5 }, i: 6 };

/** A sentence for the string cases. */
export const sentence = 'the quick brown fox jumps over the lazy dog';
