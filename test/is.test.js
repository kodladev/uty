import { describe, expect, it, test } from 'vitest';
import {
  isArrayLike,
  isAsync,
  isAsyncIterable,
  isClass,
  isCollect,
  isEmail,
  isEmpty,
  isEqual,
  isIterable,
  isKey,
  isNil,
  isObject,
  isObjects,
  isOdd,
  isPrimitive,
  isPromise,
  isRegExp,
  isServer,
  isType,
} from '../src/is.js';
import { data } from './data.js';

let entries = Object.entries(data);

describe('isArrayLike', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (
        // prettier-multiline-arrays-next-line-pattern: 4
        [
          'numberString',
          'string',
          'stringEmpty',
          'stringObject',
          'stringObjectEmpty',
          'stringObjectNew',
          'array',
          'arrayNested',
          'arrayEmpty',
          'regexString',
        ].includes(key)
      ) {
        fill = true;
      }
      expect(isArrayLike(value)).toBe(fill);
    });
  }
});

describe('isAsync', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (['functionAsync'].includes(key)) {
        fill = true;
      }
      expect(isAsync(value)).toBe(fill);
    });
  }
});

describe('isAsyncIterable', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (['iterableAsync'].includes(key)) {
        fill = true;
      }
      expect(isAsyncIterable(value)).toBe(fill);
    });
  }
});

describe('isClass', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (['class'].includes(key)) {
        fill = true;
      }
      expect(isClass(value)).toBe(fill);
    });
  }
});

describe('isCollect', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (
        // prettier-multiline-arrays-next-line-pattern: 5
        [
          'array',
          'arrayNested',
          'arrayEmpty',
          'object',
          'objectNested',
          'objectEmpty',
          'iterableAsync',
          'objectCreate',
          'objectCreateNull',
          'objectCreateEmpty',
        ].includes(key)
      ) {
        fill = true;
      }
      expect(isCollect(value)).toBe(fill);
    });
  }
});

describe('isEqual', () => {
  for (let [index, [key, value]] of entries.entries()) {
    if (['nan', 'nanNumber', 'nanZero'].includes(key)) return;
    it(key, () => {
      const ent = Object.entries(data);
      expect(isEqual(value, value)).toBe(true);
      expect(isEqual(ent[index], ent[index + 1])).toBe(false);
    });
  }
});

describe('isIterable', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (
        // prettier-multiline-arrays-next-line-pattern: 4 5 5
        [
          'string',
          'stringEmpty',
          'stringObject',
          'stringObjectEmpty',
          'stringObjectNew',
          'array',
          'arrayNested',
          'arrayEmpty',
          'map',
          'mapSet',
          'set',
          'setEmpty',
          'regexString',
          'numberString',
        ].includes(key)
      ) {
        fill = true;
      }
      expect(isIterable(value)).toBe(fill);
    });
  }
});

describe('isNil', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (['null', 'undefined', 'void0'].includes(key)) {
        fill = true;
      }
      expect(isNil(value)).toBe(fill);
    });
  }
});

describe('isObjects', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (
        // prettier-multiline-arrays-next-line-pattern: 4 4 5 6 5
        [
          'object',
          'objectNested',
          'objectEmpty',
          'iterableAsync',
          'objectCreate',
          'objectCreateEmpty',
          'numberObjectNew',
          'stringObjectNew',
          'array',
          'arrayNested',
          'arrayEmpty',
          'function',
          'functionAsync',
          'promise',
          'promiseResolve',
          'map',
          'mapSet',
          'set',
          'setEmpty',
          'null',
          'class',
          'classVariable',
          'objectCreateNull',
          'regex',
          'regexObject',
          'error',
          'weakMap',
          'date',
        ].includes(key)
      ) {
        fill = true;
      }
      expect(isObjects(value)).toBe(fill);
    });
  }
});

describe('isPrimitive', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (
        // prettier-multiline-arrays-next-line-pattern: 4 4 5 6 5 6
        [
          'numberZero',
          'number',
          'numberObject',
          'numberObjectEmpty',
          'numberNegative',
          'numberString',
          'numberOdd',
          'numberEven',
          'float',
          'string',
          'stringEmpty',
          'stringObject',
          'stringObjectEmpty',
          'boolean',
          'booleanObject',
          'true',
          'false',
          'null',
          'undefined',
          'regexString',
          'symbol',
          'symbolEmpty',
          'symbolFor',
          'symbolIterator',
          'mathPi',
          'nan',
          'nanNumber',
          'nanZero',
          'maxValue',
          'maxSafeInteger',
          'infinity',
          'dateGetTime',
          'void0',
        ].includes(key)
      ) {
        fill = true;
      }
      expect(isPrimitive(value)).toBe(fill);
    });
  }
});

describe('isPromise', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (['promise', 'promiseResolve'].includes(key)) {
        fill = true;
      }
      expect(isPromise(value)).toBe(fill);
    });
  }
});

describe('isRegExp', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      let fill = false;
      if (['regex', 'regexObject'].includes(key)) {
        fill = true;
      }
      expect(isRegExp(value)).toBe(fill);
    });
  }
});

test('isServer', () => {
  expect(isServer()).toBe(true);
});

describe('isType', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, () => {
      expect(isType(value)).toEqual(typeHelper(key));
    });
  }
});

describe('isEmpty', () => {
  for (let [index, [key, value]] of entries.entries()) {
    it(key, async () => {
      if (['promise', 'promiseResolve'].includes(key)) {
        if (key == 'promise') {
          expect(await isEmpty(value)).toBe(true);
        } else if (key == 'promiseResolve') {
          expect(await isEmpty(value)).toBe(false);
        }
        return;
      }
      let fill = false;
      if (
        // prettier-multiline-arrays-next-line-pattern: 4
        [
          'number',
          'numberObject',
          'numberObjectEmpty',
          'numberObjectNew',
          'float',
          'stringEmpty',
          'stringObjectEmpty',
          'stringObjectNew',
          'boolean',
          'booleanObject',
          'arrayEmpty',
          'objectEmpty',
          'function',
          'functionAsync',
          'map',
          'setEmpty',
          'iterableAsync',
          'true',
          'false',
          'null',
          'undefined',
          'class',
          'objectCreateNull',
          'objectCreateEmpty',
          'regex',
          'regexObject',
          'symbolEmpty',
          'error',
          'numberZero',
          'numberNegative',
          'promise',
          'mathPi',
          'nan',
          'nanNumber',
          'nanZero',
          'maxValue',
          'infinity',
          'weakMap',
          'date',
          'dateGetTime',
          'void0',
          'maxSafeInteger',
          'numberOdd',
          'numberEven',
        ].includes(key)
      ) {
        fill = true;
      }
      expect(isEmpty(value)).toBe(fill);
    });
  }
});

function typeHelper(key) {
  // prettier-multiline-arrays-set-line-pattern: 4
  if (
    [
      'numberZero',
      'number',
      'numberObject',
      'numberObjectEmpty',
      'numberObjectNew',
      'numberNegative',
      'float',
      'mathPi',
      'maxValue',
      'infinity',
      'dateGetTime',
      'maxSafeInteger',
      'numberOdd',
      'numberEven',
    ].includes(key)
  ) {
    return 'number';
  } else if (
    [
      'string',
      'stringEmpty',
      'stringObject',
      'stringObjectEmpty',
      'stringObjectNew',
      'regexString',
      'numberString',
    ].includes(key)
  ) {
    return 'string';
  } else if (['boolean', 'booleanObject', 'true', 'false'].includes(key)) {
    return 'boolean';
  } else if (['array', 'arrayNested', 'arrayEmpty'].includes(key)) {
    return 'array';
  } else if (
    [
      'object',
      'objectNested',
      'objectEmpty',
      'iterableAsync',
      'classVariable',
      'objectCreate',
      'objectCreateNull',
      'objectCreateEmpty',
    ].includes(key)
  ) {
    return 'object';
  } else if (['function'].includes(key)) {
    return 'function';
  } else if (['functionAsync'].includes(key)) {
    return 'async';
  } else if (['promise', 'promiseResolve'].includes(key)) {
    return 'promise';
  } else if (['map', 'mapSet'].includes(key)) {
    return 'map';
  } else if (['set', 'setEmpty'].includes(key)) {
    return 'set';
  } else if (['null'].includes(key)) {
    return 'null';
  } else if (['undefined', 'void0'].includes(key)) {
    return 'undefined';
  } else if (['class'].includes(key)) {
    return 'class';
  } else if (['regex', 'regexObject'].includes(key)) {
    return 'regExp';
  } else if (['symbol', 'symbolEmpty', 'symbolFor', 'symbolIterator'].includes(key)) {
    return 'symbol';
  } else if (['error'].includes(key)) {
    return 'error';
  } else if (['nan', 'nanNumber', 'nanZero'].includes(key)) {
    return 'NaN';
  } else if (['weakMap'].includes(key)) {
    return 'weakMap';
  } else if (['date'].includes(key)) {
    return 'date';
  }
}

describe('isEqual:content', () => {
  it('isEqual:primitive', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, '1')).toBe(false);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(0, null)).toBe(false);
  });

  it('isEqual:array', () => {
    expect(isEqual([1, [2, { a: 3 }]], [1, [2, { a: 3 }]])).toBe(true);
    expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false);
    expect(isEqual([1], { 0: 1 })).toBe(false);
  });

  it('isEqual:object', () => {
    expect(isEqual({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    expect(isEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  it('isEqual:date', () => {
    expect(isEqual(new Date(1000), new Date(1000))).toBe(true);
    expect(isEqual(new Date(1000), new Date(1001))).toBe(false);
  });

  it('isEqual:regexp', () => {
    expect(isEqual(/a/g, /a/g)).toBe(true);
    expect(isEqual(/a/g, /a/i)).toBe(false);
  });

  it('isEqual:map', () => {
    expect(isEqual(new Map([[1, { a: 1 }]]), new Map([[1, { a: 1 }]]))).toBe(true);
    expect(isEqual(new Map([[1, 1]]), new Map([[2, 2]]))).toBe(false);
    expect(isEqual(new Map([[1, 1]]), new Map())).toBe(false);
  });

  it('isEqual:set', () => {
    expect(isEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });

  it('isEqual:error', () => {
    expect(isEqual(new Error('a'), new Error('a'))).toBe(true);
    expect(isEqual(new Error('a'), new Error('b'))).toBe(false);
    expect(isEqual(new Error('a'), new TypeError('a'))).toBe(false);
  });

  it('isEqual:class', () => {
    class Point {
      constructor(x) {
        this.x = x;
      }
    }
    class Other {
      constructor(x) {
        this.x = x;
      }
    }
    expect(isEqual(new Point(1), new Point(1))).toBe(true);
    expect(isEqual(new Point(1), new Point(2))).toBe(false);
    expect(isEqual(new Point(1), new Other(1))).toBe(false);
    expect(isEqual(new Point(1), { x: 1 })).toBe(false);
  });

  it('isEqual:identity:only', () => {
    const fn = () => 1;
    const promise = Promise.resolve(1);
    expect(isEqual(fn, fn)).toBe(true);
    expect(
      isEqual(
        () => 1,
        () => 1
      )
    ).toBe(false);
    expect(isEqual(promise, promise)).toBe(true);
    expect(isEqual(Promise.resolve(1), Promise.resolve(1))).toBe(false);
    expect(isEqual(new WeakMap(), new WeakMap())).toBe(false);
    expect(isEqual(Symbol('a'), Symbol('a'))).toBe(false);
  });
});

describe('isEmail', () => {
  it('isEmail:valid', () => {
    expect(isEmail('someone@example.com')).toBe(true);
    expect(isEmail('first.last+tag@mail.example.photography')).toBe(true);
  });

  it('isEmail:invalid', () => {
    expect(isEmail('someone')).toBe(false);
    expect(isEmail('someone@example')).toBe(false);
    expect(isEmail('some one@example.com')).toBe(false);
  });

  it('isEmail:repeat', () => {
    expect(isEmail('someone@example.com')).toBe(true);
    expect(isEmail('someone@example.com')).toBe(true);
  });
});

describe('isKey', () => {
  it('isKey:own', () => {
    expect(isKey('a', { a: 1 })).toBe(true);
    expect(isKey('a', { a: undefined })).toBe(true);
    expect(isKey(1, { 1: 'x' })).toBe(true);
  });

  it('isKey:missing', () => {
    expect(isKey('b', { a: 1 })).toBe(false);
    expect(isKey('toString', {})).toBe(false);
    expect(isKey('a', [1])).toBe(false);
    expect(isKey(null, { a: 1 })).toBe(false);
  });
});

describe('isObject', () => {
  it('isObject:plain', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ constructor: 'x' })).toBe(true);
    expect(isObject(JSON.parse('{"a":1}'))).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);
    expect(isObject(Object.create({ a: 1 }))).toBe(true);
  });

  it('isObject:other', () => {
    class Point {}
    expect(isObject(new Point())).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isObject(new Date())).toBe(false);
    expect(isObject(new Map())).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject('a')).toBe(false);
  });
});

describe('isOdd', () => {
  it('isOdd:numbers', () => {
    expect(isOdd(3)).toBe(true);
    expect(isOdd(-3)).toBe(true);
    expect(isOdd(2)).toBe(false);
    expect(isOdd(-2)).toBe(false);
    expect(isOdd('3')).toBe(false);
  });
});
