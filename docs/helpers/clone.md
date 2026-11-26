# Clone

Creates a deep copy of a collection using a structured cloning algorithm.

## Import

```js
import { clone } from 'uty';
```

## Mutation

Eight functions change the collection they are given, like the JavaScript methods they are named after:

- `pop`
- `prepend`
- `push`
- `remove`
- `reverse`
- `shift`
- `sort`
- `splice`

Every other function leaves its input untouched and returns a new value. To keep the original collection when you use one of these eight, pass a copy made with `clone`.

Example without using the `clone` function:

```js
import { reverse } from 'uty/collect';

const data = [1, 2, 3];
const reversed = reverse(data);

console.log(data);
//=> [3, 2, 1]

console.log(reversed);
//=> [3, 2, 1]
```

Example using the `clone` function:

```js
import { reverse } from 'uty/collect';
import { clone } from 'uty';

const data = [1, 2, 3];
const reversed = reverse(clone(data));

console.log(data);
//=> [1, 2, 3]

console.log(reversed);
//=> [3, 2, 1]
```

Using `clone` ensures that the original `data` array remains unchanged, allowing you to safely manipulate its copy.
