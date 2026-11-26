# Functional Usage

Uty libraries offer a wide range of usage options based on functional programming principles. The functional approach allows effective invocation and composition of functions, departing from traditional methods. This comprehensive approach not only makes operations more understandable but also provides flexibility and modular organization freedom.

## Various Usage Options

Our libraries offer different ways to use them, based on what you need.

### 1. Classic Approach

Functions can be used by invoking them in a traditional way.

**Example**

```js
apply(Math.max, [1, 2, 3, 4]);
//=> 4
```

```js
remove(['age', 'city'], { name: 'John', age: 30, city: 'New York' });
//=> { name: 'John' }
```

### 2. Function Creation

If you need to use a function with the same logic multiple times, you can create a new function without specifying a collection.

**Example**

```js
const max = apply(Math.max);

max([1, 2, 3, 4]);
//=> 4

max([5, 6, 7, 8]);
//=> 8
```

```js
const trim = remove(['age', 'city']);

trim({ name: 'John', age: 30, city: 'New York' });
//=> { name: 'John' }

trim({ name: 'Hans', age: 50, city: 'Hamburg' });
//=> { name: 'Hans' }
```

### 3. Usage with Pipe

To combine function outputs in a sequential and understandable way, you can use the `pipe` function to compose operations.

**Example**

```js
// prettier-ignore
pipe(
  [1, 2, 3, 4],
  apply(Math.max)
);
//=> 4
```

```js
// prettier-ignore
pipe(
  { name: 'John', age: 30, city: 'New York' },
  remove(['age', 'city'])
);
//=> { name: 'John' }
```

### 4. Creating a Function with Pipe

If you need to use the same `pipe` operation multiple times, you can create a new function without specifying a collection.

For example, finding even numbers in a collection, adding 10 to these numbers, and finally summing them:

```js
// prettier-ignore
const total = pipe(
  filter((a) => a % 2 === 0),
  map((a) => a + 10),
  reduce((a, b) => a + b)
);

total([1, 2, 3, 4, 5]);
//=> 26

total([6, 7, 8, 9, 10]);
//=> 54
```

These usage options not only allow you to discover the beauty of functional programming but also make your code more effective, readable, and manageable.

> [!TIP]
> If you use our `math` library for mathematical operations, you can perform these operations more easily.

```js
import { add, divisible, sum } from 'uty/math';

const total = pipe(divisible(2), add(10), sum);

total([1, 2, 3, 4, 5]);
//=> 26

total([6, 7, 8, 9, 10]);
//=> 54
```

## Leaving out the data

Functions take their data last. A function returns a waiting function only when the data argument is left out. This is decided by how many arguments you pass, not by whether a value is `undefined`.

```js
const double = map(x => x * 2);

double([1, 2]);
//=> [2, 4]
```

Passing data a function cannot work with (`undefined`, `null`, a number where a collection is expected, ...) throws a `TypeError` that names the function.

```js
map(x => x * 2, undefined);
//=> TypeError: uty: map cannot work with undefined
```

Inside a Promise chain, the same mistake becomes a rejected Promise.

```js
await map(x => x * 2, Promise.resolve(null));
//=> Rejects with TypeError: uty: map cannot work with null
```

> [!NOTE]
> A few functions accept anything on purpose: `dot` returns the default, `size` returns `0`, `tap`, `toArray`, `toJson`, `toString` and `toStringify` work with any value, and the `is*` checks accept any value.

Uty libraries provide an enjoyable way to understand and implement functional programming.
