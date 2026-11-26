# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- The `benchmark` folder is now `bench`, like the `npm run bench` script that runs it

## [0.3.0] - 2026-11-26

### Added

- A `benchmark` folder that measures every function next to the plain JavaScript doing the same job; run it with `npm run bench`
- `sum` and `avg` accept an object and work on its values
- `pop` and `shift` wait for the collection when called with only a number: `pipe(list, pop(2))`
- Documentation for the string tools and `isEmail`
- `sideEffects: false` in the package, so bundlers can drop what is not imported

### Changed

- **Data that cannot be processed throws.** A function returns a waiting function only when the data argument is left out. Passing `undefined`, `null` or another value it cannot work with raises `TypeError` (`uty: map cannot work with undefined`) instead of quietly returning a function or `undefined`. Inside a Promise the error becomes a rejection. `dot`, `tap`, `size`, the `to*` functions and the `is*` checks keep accepting anything
- **Only eight functions change their input:** `pop`, `prepend`, `push`, `remove`, `reverse`, `shift`, `sort` and `splice`. Every other function returns a new value
- `merge` and `mergeDeep` return a new collection and leave both arguments untouched; `merge` used to change the object it merged into
- `last` with a number and `split` on an array no longer remove items from the collection they read
- `split` fills its groups as evenly as possible and no longer drops the items left over (7 items into 3 groups: 3, 2, 2)
- `join` with a final glue no longer removes the last item from the array, and always returns a string
- `prepend` on an object changes that object in place, as it already did for arrays
- `reduce` without a seed starts from the first element, like `Array.prototype.reduce`; the seed used to default to `0`
- `chunk` of an empty collection is `[]` instead of `[[]]`, and a length of zero or less throws `RangeError`
- `isEqual` compares `Date`, `RegExp`, `Error`, `Map`, `Set` and class instances by content, treats `NaN` as equal to `NaN`, and considers functions, promises and weak collections equal only to themselves
- `isObject` and `isCollect` are true for `Object.create(null)` and for an object holding a `constructor` key
- `value` and `pluck` return `undefined` or `null` for a missing nested level instead of throwing
- `dot` walks through falsy values such as `''` and `0`, and treats a `null` or `undefined` second argument as the data
- `validate` counts symbols such as `$`, `+` and `=` as special characters, next to punctuation
- `unique` treats `NaN` as equal to `NaN`
- `pipe` throws `TypeError` for a step that is not a function
- `event()` calls a listener added during an emit from the next emit on
- `remove` takes the items out of an array instead of leaving empty slots: `remove([0, 1], [1, 2, 3, 4])` is `[3, 4]`
- The email pattern accepts `+` in the local part and top-level domains of any length; `RGX_EMAIL` lost its `g` flag

### Fixed

- `mergeDeep` could write to `Object.prototype` when given an object with a `__proto__` key, for example parsed JSON
- `isEmail` answered `false` on every second call for a valid address
- `isEqual` reported two different `Map`, `Set` or class instances as equal, and two dates in the same second as equal
- `isKey` always returned `false`
- `isOdd` returned `false` for negative odd numbers
- `divisible` and `has` lost their first argument when called without the collection, which broke the `pipe` example in the README
- `sum` rounded whole totals above 12 digits
- `supplant` printed nothing for `0` and `false`, and mishandled holders longer than one character
- `pop` with a number did not remove the popped keys from an object
- `pluck` with a seed key dropped items whose seed value was `0` or an empty string
- `shift` and `diff` lost an argument when the collection was a Promise
- `keyMap` swapped keys and values for an object
- `cls` left double spaces for empty values
- `event()`: a listener registered after `off` and a stale unsubscribe was never called, and neither was a listener for an event named like a built-in property (`constructor`)

### Documentation

- The `loop` page described `iterate`; it now shows what `loop` does
- The `slice` example used a count where the function takes an end index

### Performance

- `some` and `takeUntil` stop at the first match instead of scanning the whole collection
- `unique` and `diff` use a `Set` instead of searching the array for every item
- `pluck`, `sum` and `avg` parse a key once instead of once per item; wildcard keys are walked directly
- `each`, `chunk`, `take`, `pipe`, `isEqual`, `validate` and `emit` do less work per call

## [0.2.3] - 2026-11-26

### Changed

- Releases are published from GitHub Actions through npm trusted publishing; the library code is unchanged

## [0.2.2] - 2026-11-26

### Changed

- Types are written as JSDoc: `uty/type` is now a plain JavaScript module and the generated declarations stay equivalent
- `ArrayLikeLiteral` and `ObjectLiteral` are type aliases instead of interfaces

### Fixed

- Repository links in the published package point to `kodladev/uty`

## [0.2.1] - 2024-12-12

### Fixed

- Object handling in `cls` function

## [0.2.0] - 2024-12-09

### Added

- <details>
  <summary>New <code>validate</code> function lets you check texts for various things, like length, case, special characters, numbers, and words.</summary>

  ```js
  validate('HelloWorld123!', {
    minimum: 8,
    maximum: 15,
    lowercase: 2,
    uppercase: 2,
    special: 1,
    number: 2,
    require: ['Hello'],
    disable: ['World'],
  });
  //=> ['minimum', 'maximum', 'lowercase', 'uppercase', 'special', 'number', 'require', 'disable']
  ```

  ```js
  validate('Password123!', { minimum: 8, lowercase: 2, uppercase: 2, special: 2, number: 2 });
  //=> ['minimum', 'maximum', 'lowercase', 'number']
  ```

  </details>

- <details>
  <summary>New <code>isEmail</code> function to validate email addresses.</summary>

  ```js
  isEmail('example@domain.com'); //=> true
  ```

  - New email validation regex: `RGX_EMAIL`.

    ```js
    RGX_EMAIL.test('invalid-email'); //=> false
    ```

  </details>

- <details>
  <summary>New <code>cls</code> function for combining class names.</summary>

  ```js
  cls('btn', { active: true, disabled: false }, ['extra', 'class']);
  //=> "btn active extra class"
  ```

  - Supports strings, numbers, arrays, and objects.
  - Filters out falsy values.

  </details>

### Changed

- <details>
  <summary>Enhance <code>supplant</code> function with flexible placeholder delimiters</summary>

  ```js
  supplant('{name} is learning {subject}', { name: 'Alice', subject: 'JavaScript' });
  //=> "Alice is learning JavaScript"
  ```

  ```js
  supplant('<name> loves <food.name>', ['<', '>'], { name: 'Bob', food: { name: 'pizza' } });
  //=> "Bob loves pizza"
  ```

  </details>

### Fixed

- Check objects in `join` function argument
- Adjust `dot` function argument order and handling

## [0.1.0] - 2024-11-23

### Added

- Constants and regular expressions
- Type and value checking function
- Core mathematical utility functions
- Collection helpers for better array and object handling
- String manipulation utilities
- Helper functions (pipe, clone, and prom)
- Functions for converting collections to various data types
- Customizable event emitter with listener management functions

[unreleased]: https://github.com/kodladev/uty/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/kodladev/uty/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/kodladev/uty/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/kodladev/uty/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/kodladev/uty/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/kodladev/uty/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kodladev/uty/releases/tag/v0.1.0
