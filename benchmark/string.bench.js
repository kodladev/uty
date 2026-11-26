import { bench, describe } from 'vitest';
import { supplant, ucwords, validate, words } from '../src/string.js';
import { options, sentence } from './data.js';

describe('ucwords: a sentence', () => {
  bench('uty', () => ucwords(sentence), options);
  bench(
    'native',
    () =>
      sentence
        .toLowerCase()
        .split(' ')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' '),
    options
  );
});

describe('words: a sentence', () => {
  bench('uty', () => words(sentence), options);
  bench('native', () => sentence.match(/\S+/g) || [], options);
});

describe('supplant: two placeholders', () => {
  const values = { user: { name: 'Ada' }, count: 3 };
  bench('uty', () => supplant('Hello {user.name}, you have {count} messages', values), options);
  bench('native', () => `Hello ${values.user.name}, you have ${values.count} messages`, options);
});

describe('validate: a password', () => {
  const rules = { minimum: 8, lowercase: 2, uppercase: 1, special: 1, number: 2 };
  bench('uty', () => validate('Password123!', rules), options);
  bench(
    'native',
    () => {
      const text = 'Password123!';
      const count = rgx => (text.match(rgx) || []).length;
      return [
        text.length >= 8,
        count(/\p{Ll}/gu) >= 2,
        count(/\p{Lu}/gu) >= 1,
        count(/\p{P}/gu) >= 1,
        count(/\p{N}/gu) >= 2,
      ];
    },
    options
  );
});
