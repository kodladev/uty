<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kodladev/uty/refs/heads/main/.github/assets/logo-dark.svg">
    <img alt="uty logo" src="https://raw.githubusercontent.com/kodladev/uty/refs/heads/main/.github/assets/logo.svg" width="80"/>
  </picture>
</div>

<p align="center">
  <br/>
  JavaScript helpers that work the same with plain data and Promises, on arrays and objects alike.
  <br/><br/>
</p>

<div align="center">

[![test](https://github.com/kodladev/uty/actions/workflows/test.yaml/badge.svg?branch=main)][TEST]
&nbsp;[![npm](https://img.shields.io/npm/v/uty.svg)][PACKAGE]
&nbsp;[![shaking](https://img.shields.io/badge/tree%20shakeable-blue?color=gray&logo=gumtree&logoColor=72ef36)][SIZE]

</div>

## Install

```shell
npm i uty
```

## How it behaves

```js
import { pipe } from 'uty';
import { filter, map } from 'uty/collect';
import { sum } from 'uty/math';

const total = pipe(
  filter(n => n > 1),
  map(n => n * 2),
  sum
);

total([1, 2, 3]); //=> 10
total({ a: 1, b: 2, c: 3 }); //=> 10
await total(Promise.resolve([1, 2, 3])); //=> 10
```

- **Data comes last.** Leave it out and you get a function that waits for it, ready for `pipe`.
- **Arrays and objects are both collections.** `map`, `filter` and the rest take either and keep its shape.
- **Promises pass through.** Give a function or a `pipe` a Promise and the result is a Promise.
- **Bad data throws.** Data that cannot be processed, such as `undefined`, raises a `TypeError` that names the function.
- **Eight functions change their input**, like the JavaScript methods they are named after: `pop`, `prepend`, `push`, `remove`, `reverse`, `shift`, `sort`, `splice`. Everything else returns a new value; [`clone`](https://github.com/kodladev/uty/blob/main/docs/helpers/clone.md) keeps the original when you need it.

## Overview

### 🔹 Type and Value Checks

Provides functions to assess variable types, compare values, and gather information about the system environment.

```js
import { isArrayLike, isEqual } from 'uty/is';

isArrayLike('fruits'); //=> true

isEqual([1, 2, 3], [1, 2, 3, 4]); //=> false
```

[`more 'is' examples`](https://github.com/kodladev/uty/blob/main/docs/libraries/type-and-value-checks.md)

### 🔹 Collection Interactions

Helpers for working with arrays and objects, providing functions for data extraction and manipulation.

```js
import { pluck } from 'uty/collect';

pluck('name', 'detail.date', [
  { name: 'Albert', detail: { date: 1879 } },
  { name: 'Isaac', detail: { date: 1643 } },
]);

//=> {1879: 'Albert', 1643: 'Isaac'}
```

[`more 'collect' examples`](https://github.com/kodladev/uty/blob/main/docs/libraries/collection-interactions.md)

### 🔹 Mathematical Operations

Efficient tools for a wide range of mathematical calculations designed to simplify number handling and analysis.

```js
import { avg } from 'uty/math';

avg('pages', [
  { name: 'Les Miserables', pages: 176 },
  { name: 'My Left Foot', pages: 1096 },
]);
//=> 636
```

[`more 'math' examples`](https://github.com/kodladev/uty/blob/main/docs/libraries/mathematical-operations.md)

### 🔹 String Tools

Utility functions for easy and efficient string manipulation and formatting.

```js
import { ucfirst, ucwords } from 'uty/string';

ucfirst('uty is simple'); //=> Uty is simple
ucwords('uty is simple'); //=> Uty Is Simple
```

[`more 'string' examples`](https://github.com/kodladev/uty/blob/main/docs/libraries/string-tools.md)

### 🔹 Data Transformation

Converts data types and structures, making it easy to switch between arrays, objects, and other formats.

```js
import { toArray } from 'uty/to';

toArray({ first: 'Lionel', middle: 'Andrés', last: 'Messi' });
//=> ['Lionel', 'Andrés', 'Messi']
```

[`more 'to' examples`](https://github.com/kodladev/uty/blob/main/docs/libraries/data-transformation.md)

### 🔹 Helpers

Commonly used utility functions that streamline coding patterns and reduce repetitive tasks.

```js
import { pipe } from 'uty';
import { divisible, add, sum } from 'uty/math';

const total = pipe(divisible(2), add(10), sum);

total([1, 2, 3, 4, 5]);
//=> 26

await total(Promise.resolve([6, 7, 8, 9, 10]));
//=> 54
```

[`more helpers`](https://github.com/kodladev/uty/tree/main/docs/helpers)

### 🔹 Event Listeners

A simple, customizable event system for handling and emitting events.

```js
import { event } from 'uty/event';

const bus = event();

bus.on('tick', number => {
  console.log(number);
});

bus.emit('tick', 1);
//=> 1
```

[`more 'event' examples`](https://github.com/kodladev/uty/blob/main/docs/libraries/event-listeners.md)

### 🔹 Define Hub

A set of consistent values used throughout the application to maintain clarity and reduce redundancy.

```js
import { MAX_SAFE_INTEGER, RGX_WHITESPACE } from 'uty/define';

console.log(MAX_SAFE_INTEGER); //=> 9007199254740991
console.log(RGX_WHITESPACE); //=> /^\s*$/
```

### 🔹 Type Utilities

Advanced type-checking and utilities to ensure safe operations.

```ts
import type { Include } from 'uty/type';

function isArray<T>(value: T): value is Include<T, unknown[] | Readonly<unknown[]>> {
  return Array.isArray(value);
}
```

## Documentation

Visit our [documentation][DOCUMENTATION] for detailed guides and references.

## Benchmark

Every function is measured next to the plain JavaScript that does the same job:

```shell
npm run bench
```

---

<details>
<summary>Release Notes</summary>

All notable changes to this project will be documented in the [changelog][CHANGELOG].

</details>

<details>
<summary>License</summary>

[MIT][LICENSE]

</details>

[TEST]: https://github.com/kodladev/uty/actions/workflows/test.yaml
[PACKAGE]: https://www.npmjs.com/package/uty
[SIZE]: https://bundlephobia.com/package/uty
[LICENSE]: https://github.com/kodladev/uty/blob/main/LICENSE
[CHANGELOG]: https://github.com/kodladev/uty/blob/main/CHANGELOG.md
[DOCUMENTATION]: https://github.com/kodladev/uty/tree/main/docs
