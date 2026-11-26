import { bench, describe } from 'vitest';
import {
  chunk,
  cls,
  diff,
  dot,
  each,
  filter,
  flat,
  join,
  last,
  map,
  merge,
  mergeDeep,
  pluck,
  reduce,
  some,
  take,
  takeUntil,
  unique,
} from '../src/collect.js';
import { big, config, object, options, other, overrides, records, small } from './data.js';

const active = true;
const size = 'md';

describe('cls: a typical component call', () => {
  bench('uty', () => cls('button', size, { active, disabled: false }, ['a', 'b']), options);
  bench(
    'native',
    () => ['button', size, active && 'active', 'a', 'b'].filter(Boolean).join(' '),
    options
  );
});

describe('map: array of 5', () => {
  bench('uty', () => map(n => n * 2, small), options);
  bench('native', () => small.map(n => n * 2), options);
});

describe('map: array of 10,000', () => {
  bench('uty', () => map(n => n * 2, big), options);
  bench('native', () => big.map(n => n * 2), options);
});

describe('map: object of 100', () => {
  bench('uty', () => map(n => n * 2, object), options);
  bench(
    'native',
    () => Object.fromEntries(Object.entries(object).map(([k, v]) => [k, v * 2])),
    options
  );
});

describe('filter: array of 10,000', () => {
  bench('uty', () => filter(n => n % 2 === 0, big), options);
  bench('native', () => big.filter(n => n % 2 === 0), options);
});

describe('filter: object of 100', () => {
  bench('uty', () => filter(n => n % 2 === 0, object), options);
  bench(
    'native',
    () => Object.fromEntries(Object.entries(object).filter(([, v]) => v % 2 === 0)),
    options
  );
});

describe('each: array of 10,000', () => {
  bench(
    'uty',
    () => {
      let total = 0;
      each(n => {
        total += n;
      }, big);
      return total;
    },
    options
  );
  bench(
    'native',
    () => {
      let total = 0;
      for (const n of big) total += n;
      return total;
    },
    options
  );
});

describe('reduce: array of 10,000', () => {
  bench('uty', () => reduce((a, b) => a + b, 0, big), options);
  bench('native', () => big.reduce((a, b) => a + b, 0), options);
});

describe('some: predicate matching the first of 10,000', () => {
  bench('uty', () => some(n => n === 0, big), options);
  bench('native', () => big.some(n => n === 0), options);
});

describe('some: key and value in 1,000 records', () => {
  bench('uty', () => some('name', 'name-999', records), options);
  bench('native', () => records.some(r => r.name === 'name-999'), options);
});

describe('unique: 10,000 distinct numbers', () => {
  bench('uty', () => unique(big), options);
  bench('native', () => [...new Set(big)], options);
});

describe('unique: 1,000 records by key', () => {
  bench('uty', () => unique('id', records), options);
  bench(
    'native',
    () => {
      const seen = new Set();
      return records.filter(r => !seen.has(r.id) && seen.add(r.id));
    },
    options
  );
});

describe('diff: 10,000 numbers against 1,000', () => {
  bench('uty', () => diff(other, big), options);
  bench(
    'native',
    () => {
      const set = new Set(other);
      return big.filter(n => !set.has(n));
    },
    options
  );
});

describe('chunk: 10,000 numbers by 10', () => {
  bench('uty', () => chunk(10, big), options);
  bench(
    'native',
    () => {
      const chunks = [];
      for (let i = 0; i < big.length; i += 10) chunks.push(big.slice(i, i + 10));
      return chunks;
    },
    options
  );
});

describe('take: first 10 of 10,000', () => {
  bench('uty', () => take(10, big), options);
  bench('native', () => big.slice(0, 10), options);
});

describe('takeUntil: stops at the 10th of 10,000', () => {
  bench('uty', () => takeUntil(10, big), options);
  bench('native', () => big.slice(0, big.indexOf(10)), options);
});

describe('pluck: key from 1,000 records', () => {
  bench('uty', () => pluck('name', records), options);
  bench('native', () => records.map(r => r.name), options);
});

describe('pluck: nested key from 1,000 records', () => {
  bench('uty', () => pluck('detail.date', records), options);
  bench('native', () => records.map(r => r.detail.date), options);
});

describe('pluck: wildcard over 100 records', () => {
  const list = { items: records.slice(0, 100) };
  bench('uty', () => pluck('items.*.name', list), options);
  bench('native', () => list.items.map(r => r.name), options);
});

describe('merge: two small objects', () => {
  bench('uty', () => merge(overrides, config), options);
  bench('native', () => ({ ...config, ...overrides }), options);
});

describe('mergeDeep: nested objects', () => {
  bench('uty', () => mergeDeep(overrides, config), options);
  bench(
    'native',
    () => {
      const result = structuredClone(config);
      result.b.d.e = overrides.b.d.e;
      result.b.h = overrides.b.h;
      result.i = overrides.i;
      return result;
    },
    options
  );
});

describe('dot: nested key', () => {
  bench('uty', () => dot('b.d.e', config), options);
  bench('native', () => config?.b?.d?.e, options);
});

describe('last: array of 10,000', () => {
  bench('uty', () => last(big), options);
  bench('native', () => big.at(-1), options);
});

describe('join: 5 items with a final glue', () => {
  bench('uty', () => join(', ', ' and ', [1, 2, 3, 4, 5]), options);
  bench(
    'native',
    () => {
      const list = [1, 2, 3, 4, 5];
      return list.slice(0, -1).join(', ') + ' and ' + list.at(-1);
    },
    options
  );
});

describe('flat: 1,000 pairs', () => {
  const pairs = records.map(r => [r.id, r.price]);
  bench('uty', () => flat(pairs), options);
  bench('native', () => pairs.flat(), options);
});
