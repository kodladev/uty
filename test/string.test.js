import { describe, expect, it } from 'vitest';
import {
  lower,
  removePunct,
  sub,
  supplant,
  ucfirst,
  ucwords,
  upper,
  validate,
  words,
} from '../src/string.js';

describe('lower', () => {
  it('lower:text', () => {
    expect(lower('LOREM')).toEqual('lorem');
  });
});

describe('sub', () => {
  it('sub:text', () => {
    expect(sub('Lorem')).toEqual('orem');
  });

  it('sub:start', () => {
    expect(sub(0, 'Lorem')).toEqual('Lorem');
  });

  it('sub:end', () => {
    expect(sub(0, 1, 'Lorem')).toEqual('L');
  });
});

describe('upper', () => {
  it('upper:text', () => {
    expect(upper('lorem')).toEqual('LOREM');
  });
});

describe('validate', () => {
  it('validate:1', () => {
    expect(
      validate('HelloWorld123!', {
        minimum: 8,
        maximum: 15,
        lowercase: 2,
        uppercase: 2,
        special: 1,
        number: 2,
        require: ['Hello'],
        disable: ['World'],
      })
    ).toEqual([
      'minimum',
      'maximum',
      'lowercase',
      'uppercase',
      'special',
      'number',
      'require',
      'disable',
    ]);
  });

  it('validate:2', () => {
    expect(
      validate('Password123!', { minimum: 8, lowercase: 2, uppercase: 2, special: 2, number: 2 })
    ).toEqual(['minimum', 'maximum', 'lowercase', 'number']);
  });
});

describe('words', () => {
  it('words:true', () => {
    const result = words(true, 'Lorem ipsum\ndolor sit amet, consectetur adipiscing\telit.');
    const expected = [
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
    ];
    expect(result).toEqual(expected);
  });

  it('words:false', () => {
    const result = words('Lorem ipsum\ndolor sit amet, consectetur adipiscing\telit.');
    const expected = [
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet,',
      'consectetur',
      'adipiscing',
      'elit.',
    ];
    expect(result).toEqual(expected);
  });
});

describe('locale', () => {
  it('lower:locale', () => {
    expect(lower('tr', 'ISPARTA')).toEqual('ısparta');
    expect(lower(['tr'])('ISPARTA')).toEqual('ısparta');
  });

  it('upper:locale', () => {
    expect(upper('tr', 'izmir')).toEqual('İZMİR');
  });
});

describe('removePunct', () => {
  it('removePunct:text', () => {
    expect(removePunct('Hello, world!')).toEqual('Hello world');
  });
});

describe('supplant', () => {
  it('supplant:object', () => {
    expect(supplant('Hello {user.name}', { user: { name: 'Ada' } })).toEqual('Hello Ada');
  });

  it('supplant:falsy:values', () => {
    expect(supplant('{count} of {total}', { count: 0, total: 5 })).toEqual('0 of 5');
    expect(supplant('{done}', { done: false })).toEqual('false');
  });

  it('supplant:missing', () => {
    expect(supplant('{a}{b}', { a: 1 })).toEqual('1');
  });

  it('supplant:holders', () => {
    expect(supplant('Hi {{name}}', ['{{', '}}'], { name: 'Ada' })).toEqual('Hi Ada');
    expect(supplant('Hi [name]', ['[', ']'], { name: 'Ada' })).toEqual('Hi Ada');
  });

  it('supplant:curry', () => {
    expect(supplant('Hi {name}')({ name: 'Ada' })).toEqual('Hi Ada');
    expect(supplant({ name: 'Ada' })('Hi {name}')).toEqual('Hi Ada');
  });
});

describe('ucfirst', () => {
  it('ucfirst:text', () => {
    expect(ucfirst('uty is simple')).toEqual('Uty is simple');
  });

  it('ucfirst:locale', () => {
    expect(ucfirst('tr', 'istanbul')).toEqual('İstanbul');
  });
});

describe('ucwords', () => {
  it('ucwords:text', () => {
    expect(ucwords('uty IS simple')).toEqual('Uty Is Simple');
  });

  it('ucwords:locale', () => {
    expect(ucwords('tr', 'ilk iş')).toEqual('İlk İş');
  });
});

describe('validate:special', () => {
  it('validate:symbols', () => {
    expect(validate('Pa$$word1', { special: 2 })).toContain('special');
    expect(validate('Password1', { special: 1 })).not.toContain('special');
  });

  it('validate:counts', () => {
    expect(validate('abC1', { lowercase: 2, uppercase: 2, number: 1 })).toEqual([
      'minimum',
      'maximum',
      'lowercase',
      'number',
    ]);
  });
});
