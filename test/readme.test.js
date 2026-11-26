import { describe, expect, it } from 'vitest';
import { filter, map, pluck } from '../src/collect.js';
import { MAX_SAFE_INTEGER, RGX_WHITESPACE } from '../src/define.js';
import { event } from '../src/event.js';
import { pipe } from '../src/index.js';
import { isArrayLike, isEqual } from '../src/is.js';
import { add, avg, divisible, sum } from '../src/math.js';
import { ucfirst, ucwords } from '../src/string.js';
import { toArray } from '../src/to.js';

/**
 * Every example shown in README.md, so the first thing a visitor reads is known to work.
 */
describe('readme', () => {
  it('how it behaves', async () => {
    const total = pipe(
      filter(n => n > 1),
      map(n => n * 2),
      sum
    );

    expect(total([1, 2, 3])).toBe(10);
    expect(total({ a: 1, b: 2, c: 3 })).toBe(10);
    expect(await total(Promise.resolve([1, 2, 3]))).toBe(10);
  });

  it('is', () => {
    expect(isArrayLike('fruits')).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
  });

  it('collect', () => {
    expect(
      pluck('name', 'detail.date', [
        { name: 'Albert', detail: { date: 1879 } },
        { name: 'Isaac', detail: { date: 1643 } },
      ])
    ).toEqual({ 1879: 'Albert', 1643: 'Isaac' });
  });

  it('math', () => {
    expect(
      avg('pages', [
        { name: 'Les Miserables', pages: 176 },
        { name: 'My Left Foot', pages: 1096 },
      ])
    ).toBe(636);
  });

  it('string', () => {
    expect(ucfirst('uty is simple')).toBe('Uty is simple');
    expect(ucwords('uty is simple')).toBe('Uty Is Simple');
  });

  it('to', () => {
    expect(toArray({ first: 'Lionel', middle: 'Andrés', last: 'Messi' })).toEqual([
      'Lionel',
      'Andrés',
      'Messi',
    ]);
  });

  it('pipe', async () => {
    const total = pipe(divisible(2), add(10), sum);

    expect(total([1, 2, 3, 4, 5])).toBe(26);
    expect(await total(Promise.resolve([6, 7, 8, 9, 10]))).toBe(54);
  });

  it('event', () => {
    const bus = event();
    const ticks = [];

    bus.on('tick', number => {
      ticks.push(number);
    });

    bus.emit('tick', 1);
    expect(ticks).toEqual([1]);
  });

  it('define', () => {
    expect(MAX_SAFE_INTEGER).toBe(9007199254740991);
    expect(RGX_WHITESPACE).toEqual(/^\s*$/);
  });
});
