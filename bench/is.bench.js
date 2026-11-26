import { bench, describe } from 'vitest';
import { isEmail, isEmpty, isEqual, isObject, isString } from '../src/is.js';
import { config, options } from './data.js';

const copy = structuredClone(config);

describe('isEqual: nested objects', () => {
  bench('uty', () => isEqual(config, copy), options);
  bench('native', () => JSON.stringify(config) === JSON.stringify(copy), options);
});

describe('isEmpty: object', () => {
  bench('uty', () => isEmpty(config), options);
  bench('native', () => Object.keys(config).length === 0, options);
});

describe('isObject: plain object', () => {
  bench('uty', () => isObject(config), options);
  bench(
    'native',
    () => config !== null && typeof config === 'object' && !Array.isArray(config),
    options
  );
});

describe('isString', () => {
  bench('uty', () => isString('uty'), options);
  bench('native', () => typeof 'uty' === 'string', options);
});

describe('isEmail', () => {
  bench('uty', () => isEmail('someone@example.com'), options);
  bench('native', () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test('someone@example.com'), options);
});
