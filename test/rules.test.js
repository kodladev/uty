import { describe, expect, it } from 'vitest';
import {
  apply,
  chunk,
  diff,
  each,
  entries,
  every,
  filter,
  flat,
  has,
  implode,
  join,
  keyMap,
  keys,
  last,
  map,
  merge,
  mergeDeep,
  pluck,
  pop,
  prepend,
  push,
  reduce,
  remove,
  reverse,
  shift,
  slice,
  some,
  sort,
  splice,
  split,
  take,
  takeUntil,
  tap,
  unique,
  value,
  values,
  walk,
} from '../src/collect.js';
import { clone, pipe } from '../src/index.js';
import { add, avg, divisible, size, sum } from '../src/math.js';
import {
  lower,
  removePunct,
  sub,
  supplant,
  ucfirst,
  ucwords,
  upper,
  words,
} from '../src/string.js';
import { toArray, toJson, toString, toStringify } from '../src/to.js';

const fn = () => true;

/**
 * Each entry calls a function with its data argument set to the given value.
 */
const withData = {
  apply: data => apply(fn, data),
  chunk: data => chunk(2, data),
  diff: data => diff([1], data),
  each: data => each(fn, data),
  entries: data => entries(data),
  every: data => every(fn, data),
  filter: data => filter(fn, data),
  'filter:default': data => filter(data),
  flat: data => flat(1, data),
  'flat:default': data => flat(data),
  has: data => has(1, data),
  implode: data => implode(',', data),
  join: data => join(',', data),
  'join:final': data => join(',', ' and ', data),
  keyMap: data => keyMap(data),
  keys: data => keys(data),
  last: data => last(data),
  'last:fn': data => last(fn, data),
  map: data => map(fn, data),
  merge: data => merge({}, data),
  mergeDeep: data => mergeDeep({}, data),
  pluck: data => pluck('a', data),
  pop: data => pop(data),
  'pop:size': data => pop(2, data),
  prepend: data => prepend(1, data),
  push: data => push(1, data),
  reduce: data => reduce(fn, data),
  'reduce:seed': data => reduce(fn, 0, data),
  remove: data => remove('a', data),
  reverse: data => reverse(data),
  shift: data => shift(data),
  slice: data => slice(1, data),
  some: data => some(fn, data),
  'some:value': data => some('a', 1, data),
  sort: data => sort(data),
  'sort:fn': data => sort(fn, data),
  splice: data => splice(1, data),
  split: data => split(2, data),
  take: data => take(1, data),
  takeUntil: data => takeUntil(1, data),
  unique: data => unique(data),
  'unique:key': data => unique('a', data),
  value: data => value('a', data),
  values: data => values(data),
  walk: data => walk(fn, data),
  add: data => add(1, data),
  avg: data => avg(data),
  'avg:key': data => avg('a', data),
  divisible: data => divisible(2, data),
  sum: data => sum(data),
  'sum:key': data => sum('a', data),
  lower: data => lower(data),
  'lower:locale': data => lower('en', data),
  removePunct: data => removePunct(data),
  sub: data => sub(1, data),
  'sub:end': data => sub(0, 1, data),
  supplant: data => supplant('{a}', data),
  ucfirst: data => ucfirst(data),
  ucwords: data => ucwords(data),
  upper: data => upper(data),
  words: data => words(data),
};

describe('rule: data that cannot be processed throws', () => {
  for (const [name, call] of Object.entries(withData)) {
    it(`${name}:undefined`, () => {
      expect(() => call(undefined)).toThrow(TypeError);
      expect(() => call(undefined)).toThrow(/^uty: \w+ cannot work with undefined$/);
    });

    it(`${name}:null`, () => {
      expect(() => call(null)).toThrow(/^uty: \w+ cannot work with null$/);
    });
  }

  it('wrong:kind', () => {
    expect(() => map(fn, 5)).toThrow('uty: map cannot work with number');
    expect(() => keys([1])).toThrow('uty: keys cannot work with array');
    expect(() => reverse({})).toThrow('uty: reverse cannot work with object');
    expect(() => lower(5, 5)).toThrow('uty: lower cannot work with number');
  });

  it('pipe', () => {
    expect(() => pipe(undefined, filter(fn), map(fn))).toThrow(
      'uty: filter cannot work with undefined'
    );
  });

  it('promise', async () => {
    await expect(map(fn, Promise.resolve(undefined))).rejects.toThrow(
      'uty: map cannot work with undefined'
    );
    await expect(pipe(Promise.resolve(null), filter(fn))).rejects.toThrow(
      'uty: filter cannot work with null'
    );
  });
});

describe('rule: a missing argument returns a waiting function', () => {
  const waiting = {
    apply: () => apply(fn),
    chunk: () => chunk(2),
    diff: () => diff([1]),
    each: () => each(fn),
    entries: () => entries(),
    every: () => every(fn),
    filter: () => filter(fn),
    'filter:default': () => filter(),
    flat: () => flat(),
    'flat:depth': () => flat(2),
    has: () => has(1),
    implode: () => implode(','),
    join: () => join(','),
    'join:final': () => join(',', ' and '),
    keyMap: () => keyMap(),
    keys: () => keys(),
    last: () => last(),
    'last:fn': () => last(fn),
    'last:number': () => last(2),
    map: () => map(fn),
    merge: () => merge({}),
    mergeDeep: () => mergeDeep({}),
    pluck: () => pluck('a'),
    pop: () => pop(),
    'pop:size': () => pop(2),
    prepend: () => prepend(1),
    push: () => push(1),
    reduce: () => reduce(fn),
    'reduce:pair': () => reduce([fn, 0]),
    remove: () => remove('a'),
    reverse: () => reverse(),
    shift: () => shift(),
    'shift:count': () => shift(2),
    slice: () => slice(1),
    some: () => some(fn),
    'some:value': () => some('a', 1),
    sort: () => sort(),
    'sort:fn': () => sort(fn),
    splice: () => splice(1),
    split: () => split(2),
    take: () => take(1),
    takeUntil: () => takeUntil(1),
    tap: () => tap(fn),
    unique: () => unique(),
    'unique:key': () => unique('a'),
    value: () => value('a'),
    values: () => values(),
    walk: () => walk(fn),
    add: () => add(1),
    avg: () => avg(),
    'avg:key': () => avg('a'),
    divisible: () => divisible(2),
    size: () => size(),
    sum: () => sum(),
    'sum:key': () => sum('a'),
    lower: () => lower(),
    removePunct: () => removePunct(),
    sub: () => sub(1),
    'sub:end': () => sub(0, 1),
    supplant: () => supplant('{a}'),
    ucfirst: () => ucfirst(),
    ucwords: () => ucwords(),
    upper: () => upper(),
    words: () => words(),
    toArray: () => toArray(),
    toJson: () => toJson(),
    toString: () => toString(),
    toStringify: () => toStringify(),
  };

  for (const [name, call] of Object.entries(waiting)) {
    it(name, () => {
      expect(call()).toBeTypeOf('function');
    });
  }

  it('waiting:function:throws:on:bad:data', () => {
    expect(() => map(fn)(undefined)).toThrow(TypeError);
    expect(() => pluck('a')(undefined)).toThrow(TypeError);
    expect(() => some(fn)(undefined)).toThrow(TypeError);
    expect(() => push(1)(undefined)).toThrow(TypeError);
    expect(() => sum('a')(undefined)).toThrow(TypeError);
    expect(() => lower()(undefined)).toThrow(TypeError);
  });
});

describe('rule: tolerant functions accept anything', () => {
  it('size', () => {
    expect(size(undefined)).toBe(0);
    expect(size(null)).toBe(0);
  });

  it('tap', () => {
    expect(tap(fn, undefined)).toBeUndefined();
  });

  it('to', () => {
    expect(toArray(undefined)).toEqual([undefined]);
    expect(toArray(null)).toEqual([null]);
    expect(toString(undefined)).toBe('undefined');
    expect(toStringify(null)).toBe('null');
    expect(toJson(null)).toBe('null');
  });
});

describe('rule: only the named functions change their input', () => {
  const array = () => [3, 1, 2, 2];
  const object = () => ({ c: 3, a: 1, b: { d: 2 } });

  const pure = {
    chunk: data => chunk(2, data),
    diff: data => diff(isArrayData(data) ? [1] : { a: 1 }, data),
    each: data => each(fn, data),
    every: data => every(fn, data),
    filter: data => filter(fn, data),
    'filter:default': data => filter(data),
    flat: data => flat(data),
    join: data => join(', ', ' and ', data),
    keyMap: data => keyMap(data),
    last: data => last(data),
    'last:number': data => last(2, data),
    map: data => map(fn, data),
    merge: data => merge(isArrayData(data) ? [9] : { z: 9 }, data),
    mergeDeep: data => mergeDeep(isArrayData(data) ? [9] : { b: { e: 9 } }, data),
    pluck: data => pluck('a', data),
    reduce: data => reduce((a, b) => a ?? b, data),
    some: data => some(fn, data),
    take: data => take(1, data),
    takeUntil: data => takeUntil(2, data),
    value: data => value('a', data),
    values: data => values(data),
    sum: data => sum(isArrayData(data) ? data : { a: 1 }),
  };

  function isArrayData(data) {
    return Array.isArray(data);
  }

  for (const [name, call] of Object.entries(pure)) {
    it(`${name}:array`, () => {
      const data = array();
      call(data);
      expect(data).toEqual(array());
    });

    it(`${name}:object`, () => {
      const data = object();
      call(data);
      expect(data).toEqual(object());
      expect(Object.keys(data)).toEqual(Object.keys(object()));
    });
  }

  it('array:only', () => {
    const data = array();
    split(2, data);
    slice(1, data);
    unique(data);
    implode(',', data);
    expect(data).toEqual(array());
  });

  it('changes:array', () => {
    const changed = {
      pop: data => pop(data),
      prepend: data => prepend(0, data),
      push: data => push(4, data),
      remove: data => remove(0, data),
      reverse: data => reverse(data),
      shift: data => shift(data),
      sort: data => sort(data),
      splice: data => splice([0, 1], data),
    };
    for (const [name, call] of Object.entries(changed)) {
      const data = array();
      call(data);
      expect(data, name).not.toEqual(array());
    }
  });

  it('changes:object', () => {
    const changed = {
      pop: data => pop(data),
      prepend: data => prepend('z', 0, data),
      push: data => push('z', 0, data),
      remove: data => remove('a', data),
    };
    for (const [name, call] of Object.entries(changed)) {
      const data = object();
      call(data);
      expect(Object.keys(data), name).not.toEqual(Object.keys(object()));
    }
  });

  it('clone:keeps:the:original', () => {
    const data = array();
    expect(sort(clone(data))).toEqual([1, 2, 2, 3]);
    expect(data).toEqual(array());
  });
});
