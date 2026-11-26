import { bench, describe } from 'vitest';
import { avg, size, sum } from '../src/math.js';
import { big, object, options, records } from './data.js';

describe('sum: 10,000 numbers', () => {
  bench('uty', () => sum(big), options);
  bench('native', () => big.reduce((a, b) => a + b, 0), options);
});

describe('sum: key of 1,000 records', () => {
  bench('uty', () => sum('price', records), options);
  bench('native', () => records.reduce((a, r) => a + r.price, 0), options);
});

describe('sum: function over 1,000 records', () => {
  bench('uty', () => sum(r => r.price, records), options);
  bench('native', () => records.reduce((a, r) => a + r.price, 0), options);
});

describe('avg: key of 1,000 records', () => {
  bench('uty', () => avg('price', records), options);
  bench('native', () => records.reduce((a, r) => a + r.price, 0) / records.length, options);
});

describe('size: object of 100', () => {
  bench('uty', () => size(object), options);
  bench('native', () => Object.keys(object).length, options);
});
