import { bench, describe } from 'vitest';
import { filter, map } from '../src/collect.js';
import { event } from '../src/event.js';
import { pipe } from '../src/index.js';
import { sum } from '../src/math.js';
import { big, options, small } from './data.js';

const total = pipe(
  filter(n => n > 1),
  map(n => n * 2),
  sum
);

describe('pipe: filter, map and sum over 5', () => {
  bench('uty', () => total(small), options);
  bench(
    'native',
    () =>
      small
        .filter(n => n > 1)
        .map(n => n * 2)
        .reduce((a, b) => a + b, 0),
    options
  );
});

describe('pipe: filter, map and sum over 10,000', () => {
  bench('uty', () => total(big), options);
  bench(
    'native',
    () =>
      big
        .filter(n => n > 1)
        .map(n => n * 2)
        .reduce((a, b) => a + b, 0),
    options
  );
});

describe('event: emit to 10 listeners', () => {
  const bus = event();
  const listeners = [];
  let count = 0;
  for (let i = 0; i < 10; i++) {
    const listener = n => {
      count += n;
    };
    bus.on('tick', listener);
    listeners.push(listener);
  }
  bench('uty', () => bus.emit('tick', 1), options);
  bench(
    'native',
    () => {
      for (const listener of listeners) listener(1);
      return count;
    },
    options
  );
});
