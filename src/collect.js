/**
  Collection Interactions
  --------------------------------------------------------------------------------------------------
  Useful helpers for interacting with arrays and objects.

  Every function takes its data last. Leave the data out and you get a function that waits for
  it; pass data that cannot be processed and a `TypeError` is thrown.

  `pop`, `prepend`, `push`, `remove`, `reverse`, `shift`, `sort` and `splice` change the
  collection they are given, like the JavaScript methods they are named after. Every other
  function leaves its input untouched and returns a new value.
  --------------------------------------------------------------------------------------------------
*/

import { RAW_EMPTY, RAW_WHITESPACE } from './define.js';
import { fail } from './fail.js';
import {
  isArray,
  isArrayLike,
  isAsync,
  isAsyncIterable,
  isBoolean,
  isCollect,
  isEmpty,
  isEqual,
  isFunction,
  isInteger,
  isNil,
  isNumber,
  isObject,
  isPrimitive,
  isPromise,
  isString,
  isUndefined,
} from './is.js';
import { length, size } from './math.js';

/**
 * Applies the function to the collection values.
 * @param {Function} fn - The function to apply.
 * @param {Array|Object|Promise} [collect] - The collection of values.
 * @returns {*} Returns the result of applying the function to the collection.
 */
export function apply(fn, collect) {
  if (arguments.length < 2) return collect => apply(fn, collect);
  if (isCollect(collect)) return fn(...values(collect));
  if (isPromise(collect)) return collect.then(c => apply(fn, c));
  return fail('apply', collect);
}

/**
 * Splits a collection into chunks of a specified length.
 * @param {number} length - The length of each chunk.
 * @param {Array|Object} [collect] - The collection to be chunked.
 * @returns {Array|Function} - An array of chunks if the collection is provided.
 */
export function chunk(length, collect) {
  if (arguments.length < 2) return collect => chunk(length, collect);
  if (isPromise(collect)) return collect.then(c => chunk(length, c));
  if (!(length > 0)) throw new RangeError('uty: chunk needs a length above zero');

  const chunks = [];
  if (isArray(collect)) {
    for (let index = 0; index < collect.length; index += length) {
      chunks.push(collect.slice(index, index + length));
    }
    return chunks;
  }

  if (isObject(collect)) {
    const names = Object.keys(collect);
    for (let index = 0; index < names.length; index += length) {
      const collection = {};
      for (let i = index; i < index + length && i < names.length; i++) {
        collection[names[i]] = collect[names[i]];
      }
      chunks.push(collection);
    }
    return chunks;
  }

  return fail('chunk', collect);
}

/**
 * Combines class names into one string.
 * @param {...any} collect - Class names can be strings, numbers, arrays, or objects.
 * @returns {string} A space-separated string of classes.
 */
export function cls(...collect) {
  let classes = RAW_EMPTY;
  for (let i = 0, c = length(collect); i < c; i++) {
    const arg = collect[i];
    let name = RAW_EMPTY;
    if (isString(arg) || isNumber(arg)) name = `${arg}`;
    else if (isArray(arg)) name = cls(...arg);
    else if (isObject(arg)) {
      for (const key in arg) {
        if (hasOwn(key, arg) && arg[key]) name += (name && RAW_WHITESPACE) + key;
      }
    }
    // An empty name adds nothing, so the result never carries a double or trailing space
    if (name) classes += (classes && RAW_WHITESPACE) + name;
  }
  return classes;
}

/**
 * Finds the difference between two collections. This method returns the values
 * from the original collection that are not found in the given collection.
 *
 * @param {Array|Object|Promise} values - The first collection.
 * @param {number|Array|Object|Promise} [type] - The second argument or collection.
 * @param {Array|Object|Promise} [collect] - The second collection.
 * @returns {Array|Object|Promise} Returns the difference between the two collections.
 */
export function diff(values, type, collect) {
  const count = arguments.length;
  if (count === 1) return collect => diff(values, 1, collect);
  if (count === 2) {
    if (isNumber(type)) return collect => diff(values, type, collect);
    return diff(values, 1, type);
  }

  if (isPromise(values)) return values.then(v => diff(v, type, collect));
  if (isPromise(collect)) return collect.then(c => diff(values, type, c));

  if (isArray(values) && isArray(collect)) {
    const found = new Set(values);
    const result = [];
    for (let index = 0; index < collect.length; index++) {
      if (!found.has(collect[index])) result.push(collect[index]);
    }
    return result;
  }

  if (isObject(values) && isObject(collect)) {
    const collection = {};

    if (type == 1) {
      // value diff
      for (const key of Object.keys(collect)) {
        const value = collect[key];
        if (isUndefined(values[key]) || !isEqual(values[key], value)) collection[key] = value;
      }
    }

    // TODO: Add finding difference based on object keys

    return collection;
  }

  return fail('diff', collect);
}

/**
 * Retrieves a value from an object using a dot-separated key. A missing key, or data that is
 * `null` or `undefined`, returns the default value instead of throwing.
 *
 * @param {string|string[]} key - The key (dot-separated string or array) for the nested value.
 * @param {*} [def] - The default value if the key is not found.
 * @param {Object} [collect] - The object to retrieve the value from.
 * @returns {*} - The value at the nested key, or the default value if not found.
 */
export function dot(key, def, collect) {
  const count = arguments.length;
  if (count === 1) return collect => dot(key, void 0, collect);
  if (count === 2) {
    // A string, number or boolean in second place is a default; anything else is the data.
    if (!isNil(def) && isPrimitive(def)) return collect => dot(key, def, collect);
    return dot(key, void 0, def);
  }

  let p = 0;
  key = isArray(key) ? key : isString(key) ? key.split('.') : [key];
  while (!isNil(collect) && p < length(key)) collect = collect[key[p++]];
  return isUndefined(collect) || p < length(key) ? def : collect;
}

/**
 * Iterates over each element in a collection and applies a function.
 *
 * @param {Function} fn - The function to apply to each element.
 * @param {Array|Object|Promise} collect - The collection to iterate over.
 */
export function each(fn, collect) {
  if (arguments.length < 2) return collect => each(fn, collect);
  if (isArray(collect)) {
    for (let index = 0, c = collect.length; index < c; index++) fn(collect[index], index);
    return;
  }
  if (isObject(collect)) {
    const names = Object.keys(collect);
    for (let index = 0, c = names.length; index < c; index++) {
      fn(names[index], collect[names[index]], index);
    }
    return;
  }
  if (isPromise(collect)) return collect.then(c => each(fn, c));
  return fail('each', collect);
}

/**
 * Returns an array of [key, value] pairs for each property in an object.
 *
 * @param {*} collect - The object to retrieve entries from.
 * @returns {Array<Array>} Returns an array of [key, value] pairs.
 */
export function entries(collect) {
  if (!arguments.length) return collect => entries(collect);
  if (isObject(collect)) return Object.entries(collect);
  if (isPromise(collect)) return collect.then(c => entries(c));
  return fail('entries', collect);
}

/**
 * Checks if every element in a collection satisfies a provided function.
 *
 * @param {Function} fn - The function to test each element with.
 * @param {Array|Object|Promise} [collect] - The collection to check.
 * @returns {boolean|Promise<boolean>} Returns true if every element satisfies the provided function, otherwise false.
 */
export function every(fn, collect) {
  if (arguments.length < 2) return collect => every(fn, collect);
  if (isCollect(collect)) {
    const items = values(collect);
    for (let index = 0; index < items.length; index++) {
      if (!fn(items[index], index, items)) return false;
    }
    return true;
  }
  if (isPromise(collect)) return collect.then(c => every(fn, c));
  return fail('every', collect);
}

/**
 * Filters elements of a collection based on a provided function or default filtering criteria.
 *
 * @param {*} fn - The function to test each element with or a boolean for default filtering.
 * @param {*} collect - The collection to filter.
 * @returns {*} Returns the filtered collection.
 */
export function filter(fn, collect) {
  const count = arguments.length;
  if (!count || (count === 1 && isFunction(fn))) return collect => filter(fn, collect);
  if (count === 1) return filter(false, fn);

  if (isArray(collect)) {
    const test = fn || filtered;
    // A long result is given its room up front and cut to size at the end; a short one just grows
    const result = collect.length > 64 ? new Array(collect.length) : [];
    let count = 0;
    for (let index = 0; index < collect.length; index++) {
      const item = collect[index];
      if (test(item, index, collect)) result[count++] = item;
    }
    if (count < result.length) result.length = count;
    return result;
  }

  if (isObject(collect)) {
    const result = {};
    for (const key of Object.keys(collect)) {
      const value = collect[key];
      if (fn ? fn(value, key) : filtered(value)) result[key] = value;
    }
    return result;
  }

  if (isPromise(collect)) return collect.then(c => filter(fn, c));
  return fail('filter', collect);
}

/**
 * Default filtering criteria function used in the absence of a custom function.
 *
 * @private
 * @param {*} item - The item to filter.
 * @returns {boolean} Returns true if the item passes default filtering, otherwise false.
 */
function filtered(item) {
  if (isNil(item)) return false;
  if (isArrayLike(item) || isObject(item)) return size(item);
  if (isPrimitive(item)) return true;
  return !isEmpty(item);
}

/**
 * Flattens a nested collection to a specified depth.
 *
 * @param {*} depth - The depth to flatten the collection to.
 * @param {*} collect - The collection to flatten.
 * @returns {*} Returns the flattened collection.
 */
export function flat(depth, collect) {
  const count = arguments.length;
  if (!count) return collect => flat(1, collect);
  if (count === 1) {
    if (isNumber(depth)) return collect => flat(depth, collect);
    return flat(1, depth);
  }

  if (isCollect(collect)) return values(collect).flat(depth);
  if (isPromise(collect)) return collect.then(c => flat(depth, c));
  return fail('flat', collect);
}

/**
 * Joins elements of a collection into a string, with optional glue for specific keys.
 *
 * @param {string} key - The separator or the key to pluck values from.
 * @param {string} [glue] - The separator for the plucked values.
 * @param {Array|Object} [collect] - The collection to join.
 * @returns {string|Function} The joined string or a function if `collect` is undefined.
 */
export function implode(key, glue, collect) {
  const count = arguments.length;
  if (count === 1) return collect => implode(key, void 0, collect);
  if (count === 2) {
    if (isString(glue)) return collect => implode(key, glue, collect);
    return implode(key, void 0, glue);
  }

  if (!isArray(collect)) return fail('implode', collect);
  if (isUndefined(glue)) return collect.join(key);
  return pluck(key, void 0, collect).join(glue);
}

/**
 * Iterates a function with optional stop conditions.
 *
 * @param {Function} fn - Function to execute on each iteration.
 * @param {boolean|*} stop - Stops iteration if a condition is met.
 * @param {number|Array|Promise} [length] - Number of iterations or a collection to iterate.
 * @returns {Promise|*} - Returns a result or resolves a promise if async.
 */
export function iterate(fn, stop, length) {
  const count = arguments.length;
  if (count === 1) return length => iterate(fn, false, length);
  if (count === 2) {
    if (isBoolean(stop)) return length => iterate(fn, stop, length);
    return iterate(fn, false, stop);
  }

  if (isPromise(length)) return size(length).then(l => iterate(fn, stop, l));
  else if (isArrayLike(length)) length = size(length);
  if (!isNumber(length)) return fail('iterate', length);

  let index = 0;

  const next = () => {
    if (index >= length) return;
    const result = isAsync(fn) ? fn(index).then(r => check(r)) : check(fn(index));
    return result;
  };

  function check(result) {
    if (stop && !isUndefined(result)) return result;
    index++;
    return next();
  }

  return next();
}

/**
 * Joins elements of a collection into a string with optional final glue for the last element.
 *
 * @param {string} glue - The separator for the elements.
 * @param {string} [finalGlue] - The separator for the final element.
 * @param {Array|Object} [collect] - The collection to join.
 * @returns {string|Function} The joined string or a function if `collect` is undefined.
 */
export function join(glue, finalGlue, collect) {
  const count = arguments.length;
  if (!count) return collect => join(void 0, void 0, collect);
  if (count === 1) {
    if (isCollect(glue) || isNil(glue)) return join(void 0, void 0, glue);
    return collect => join(glue, void 0, collect);
  }
  if (count === 2) {
    if (isString(finalGlue)) return collect => join(glue, finalGlue, collect);
    return join(glue, void 0, finalGlue);
  }

  if (!isCollect(collect)) return fail('join', collect);

  const collection = values(collect);
  const len = collection.length;
  if (isUndefined(finalGlue) || len < 2) return collection.join(glue);
  return collection.slice(0, -1).join(glue) + finalGlue + collection[len - 1];
}

/**
 * Creates a map of keys from a nested collection.
 *
 * @param {Array|Object} collect - Collection to map keys from.
 * @returns {Object} Map of keys and their corresponding values.
 */
export function keyMap(collect) {
  if (!arguments.length) return collect => keyMap(collect);
  if (!isCollect(collect)) return fail('keyMap', collect);

  const paths = {};

  for (const key of Object.keys(collect)) buildKeyMap(collect[key], key, paths);

  return paths;
}

/**
 * Recursively builds the key map for a given item.
 *
 * @param {any} item - Current item to process.
 * @param {string} index - Current index or key.
 * @param {Object} paths - Object to store the key map.
 */
function buildKeyMap(item, index, paths) {
  if (isCollect(item)) {
    for (const key of Object.keys(item)) buildKeyMap(item[key], `${index}.${key}`, paths);
  }

  paths[index] = item;
}

/**
 * Checks if a collection contains a specific item or items.
 *
 * @param {*} items - The item or items to check for in the collection.
 * @param {Array|string} collect - The collection to check.
 * @returns {boolean} Returns true if the collection contains the item(s), otherwise false.
 */
export function has(items, collect) {
  if (arguments.length < 2) return collect => has(items, collect);
  if (isArray(collect) || isString(collect)) return includes(items, collect);
  if (isObject(collect)) return hasOwn(items, collect);
  // TODO: Add support for multiple items
  return fail('has', collect);
}

/**
 * Checks if a collection includes a specified item.
 *
 * @param {any} item - The item to check for in the collection.
 * @param {Array} collect - The collection to search within.
 * @returns {boolean} True if the item is found in the collection, false otherwise.
 */
export function includes(item, collect) {
  return collect.includes(item);
}

/**
 * Checks if the object has the specified property.
 * @param {string} item - The property to check for.
 * @param {Object} collect - The object to check.
 * @returns {boolean} - True if the object has the property, otherwise false.
 */
export function hasOwn(item, collect) {
  return Object.prototype.hasOwnProperty.call(collect, item);
}

/**
 * Returns an array containing the keys of the specified object.
 *
 * @param {Object|Promise} [collect] - The object to extract keys from.
 * @returns {Array|Promise} Returns an array of keys.
 */
export function keys(collect) {
  if (!arguments.length) return collect => keys(collect);
  if (isObject(collect)) return Object.keys(collect);
  if (isPromise(collect)) return collect.then(c => keys(c));
  return fail('keys', collect);
}

/**
 * Returns the last element in a collection, the last element that passes a function, or the
 * last `n` elements when a number is given. The collection is left untouched.
 *
 * @param {Function|number} [fn] - The function to test each element with, or how many elements to return.
 * @param {Array|Object|Promise} collect - The collection to retrieve the last element from.
 * @returns {*} Returns the last element in the collection.
 */
export function last(fn, collect) {
  const count = arguments.length;
  if (!count || (count === 1 && (isFunction(fn) || isNumber(fn)))) {
    return collect => last(fn, collect);
  }
  if (count === 1) return last(false, fn);

  if (isPromise(collect)) return collect.then(c => last(fn, c));
  if (isFunction(fn)) collect = filter(fn, collect);
  if (isNumber(fn) && fn !== 1) return take(-fn, collect);
  if (isArray(collect)) return collect[collect.length - 1];
  if (isObject(collect)) {
    const names = Object.keys(collect);
    return collect[names[names.length - 1]];
  }
  return fail('last', collect);
}

/**
 * Iterates a function a set number of times.
 *
 * @param {Function} fn - Function to run on each iteration.
 * @param {number} length - Number of iterations.
 * @returns {*} - Returns result if defined.
 */
export function loop(fn, length) {
  for (let index = 0; index < length; index++) {
    const result = fn(index);
    if (!isUndefined(result)) return result;
  }
}

/**
 * Creates a new collection by applying a function to each element of the original collection.
 *
 * @param {Function} fn - The function to apply to each element.
 * @param {*} collect - The original collection.
 * @returns {*} Returns a new collection with the results of applying the function to each element.
 */
export function map(fn, collect) {
  if (arguments.length < 2) return collect => map(fn, collect);
  if (isArray(collect)) {
    const count = collect.length;
    const result = new Array(count);
    for (let index = 0; index < count; index++) result[index] = fn(collect[index], index, collect);
    return result;
  }
  if (isAsyncIterable(collect)) {
    const iterator = collect[Symbol.asyncIterator]();
    return {
      async next(concurrent) {
        const { done, value } = await iterator.next(concurrent);
        if (done) return { done, value };
        return {
          done: false,
          value: await fn(value),
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
  if (isObject(collect)) {
    const collection = {};
    for (const key of Object.keys(collect)) collection[key] = fn(collect[key], key);
    return collection;
  }
  if (isPromise(collect)) return collect.then(c => map(fn, c));
  return fail('map', collect);
}

/**
 * Merges two collections into a new one by concatenating arrays or combining objects. When both
 * objects hold the same key, the value from the first argument wins. Neither collection is
 * changed.
 *
 * @param {Array|Object|Promise} seed - The collection to merge in.
 * @param {Array|Object|Promise} collect - The collection to merge into.
 * @returns {Array|Object|Promise} Returns the merged collection.
 */
export function merge(seed, collect) {
  if (arguments.length < 2) return collect => merge(seed, collect);
  if (isPromise(seed)) return seed.then(s => merge(s, collect));
  if (isPromise(collect)) return collect.then(c => merge(seed, c));
  if (isArray(seed) && isArray(collect)) return collect.concat(seed);
  if (isObject(seed) && isObject(collect)) return { ...collect, ...seed };
  return fail('merge', collect);
}

/**
 * Deeply merges two collections into a new one. Nested objects are merged key by key; any other
 * value from the first argument replaces the one in the second. Neither collection is changed.
 *
 * @param {Array|Object|Promise} seed - The collection to merge in.
 * @param {Array|Object|Promise} collect - The collection to merge into.
 * @returns {Array|Object|Promise} The merged result.
 */
export function mergeDeep(seed, collect) {
  if (arguments.length < 2) return collect => mergeDeep(seed, collect);
  if (isPromise(seed)) return seed.then(s => mergeDeep(s, collect));
  if (isPromise(collect)) return collect.then(c => mergeDeep(seed, c));
  if (isArray(seed) && isArray(collect)) return collect.concat(seed);
  if (isObject(seed) && isObject(collect)) return mergeDeepObject(collect, seed);
  return fail('mergeDeep', collect);
}

/**
 * Builds a new object from `target` with `source` merged in, level by level.
 *
 * A `__proto__` key in the source is skipped, so merging parsed JSON can never reach
 * `Object.prototype`.
 *
 * @private
 * @param {Object} target - The object to start from.
 * @param {Object} source - The object whose values win.
 * @returns {Object} - The merged object.
 */
function mergeDeepObject(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key === '__proto__') continue;
    const value = source[key];
    const current = hasOwn(key, target) && isObject(target[key]) ? target[key] : {};
    result[key] = isObject(value) ? mergeDeepObject(current, value) : value;
  }
  return result;
}

/**
 * Applies a function to each element in the collection, returns the original collection.
 *
 * @param {Function} fn - Function to apply to each element.
 * @param {Array|Object} [collect] - Collection to iterate over.
 * @returns {Function|Array|Object} Function if `collect` is undefined, otherwise the original collection.
 */
export function peek(fn, collect) {
  if (arguments.length < 2) return collect => peek(fn, collect);
  return map(tap(fn), collect);
}

/**
 * Extracts values associated with a specified key from a collection.
 *
 * @param {string} key - The key to pluck values for.
 * @param {string} [seed] - Optional seed key to structure the result.
 * @param {Array|Object} [collect] - The collection to pluck values from.
 * @returns {Function|Array|Object} Function if `collect` is undefined, otherwise the plucked values.
 */
export function pluck(key, seed, collect) {
  const count = arguments.length;
  if (count === 1) return collect => pluck(key, void 0, collect);
  if (count === 2) return pluck(key, void 0, seed);
  if (isNil(collect)) return fail('pluck', collect);

  const items = isArray(collect) ? collect : [collect];
  const read = reader(key);

  if (isUndefined(seed)) {
    const result = new Array(items.length);
    for (let index = 0; index < items.length; index++) result[index] = read(items[index]);
    return result;
  }

  // A seed key turns the result into an object keyed by that value
  const collection = {};
  const name = reader(seed);

  for (let index = 0; index < items.length; index++) {
    const id = name(items[index]);
    if (!isNil(id)) collection[id] = read(items[index]);
  }

  return collection;
}

/**
 * Prepares a function that reads one key from an item. The key is parsed once, so reading it
 * from every item of a long list costs a property access; a key holding `*` collects every match.
 *
 * @private
 * @param {string} key - The key, dot-separated, optionally with wildcards.
 * @returns {Function} A function that takes an item and returns the value under the key.
 */
function reader(key) {
  if (!isString(key)) return item => value(key, item);
  if (key.indexOf('*') !== -1) return item => pluckWildcard(key, item);

  const path = key.indexOf('.') === -1 ? null : key.split('.');

  return item => {
    // A missing item fails and a nested list is read item by item, as `value` does
    if (isNil(item) || isArray(item)) return value(key, item);
    if (!path) return item[key];
    for (let p = 0; p < path.length && !isNil(item); p++) item = item[path[p]];
    return item;
  };
}

/**
 * Walks a wildcard key one segment at a time; `*` steps into every value of the current level.
 *
 * @private
 * @param {string} key - The wildcard key.
 * @param {Array|Object} collect - The collection to pluck values from.
 * @returns {Array} The plucked values.
 */
function pluckWildcard(key, collect) {
  let found = [collect];
  const path = key.split('.');

  for (let p = 0; p < path.length; p++) {
    const next = [];
    for (let index = 0; index < found.length; index++) {
      const item = found[index];
      if (path[p] === '*') {
        if (isCollect(item)) next.push(...values(item));
      } else if (!isNil(item) && !isUndefined(item[path[p]])) next.push(item[path[p]]);
    }
    found = next;
  }

  return found;
}

/**
 * Removes and returns the last item from the collection.
 * @param {number} [length] - The number of elements to pop.
 * @param {Array|Object} [collect] - The collection from which elements are to be popped.
 * @returns {*} - The popped element(s) from the collection.
 */
export function pop(length, collect) {
  const count = arguments.length;
  if (!count) return collect => pop(void 0, collect);
  if (count === 1) {
    if (isNumber(length)) return collect => pop(length, collect);
    return pop(void 0, length);
  }
  if (isPromise(collect)) return collect.then(c => pop(length, c));

  if (isUndefined(length)) length = 1;
  if (isArray(collect)) {
    if (!collect.length) return null;
    return length === 1 ? collect.pop() : collect.splice(-length);
  }
  if (isObject(collect)) {
    const names = Object.keys(collect);
    if (!names.length) return null;
    if (length === 1) {
      const name = names[names.length - 1];
      const item = collect[name];
      delete collect[name];
      return item;
    }
    const popped = {};
    for (const name of names.slice(-length)) {
      popped[name] = collect[name];
      delete collect[name];
    }
    return popped;
  }

  return fail('pop', collect);
}

/**
 * Prepends a key or value to a collection.
 *
 * @param {any} key - The key or value to prepend.
 * @param {any} [value] - The value to prepend if `collect` is an object.
 * @param {Array|Object|string} [collect] - The collection to prepend to.
 * @returns {Array|Object|string|Function} The modified collection, or a function if `collect` is undefined.
 */
export function prepend(key, value, collect) {
  const count = arguments.length;
  if (count === 1) return collect => prepend(key, void 0, collect);
  if (count === 2) {
    if (isCollect(value) || isString(value) || isNil(value)) return prepend(key, void 0, value);
    return collect => prepend(key, value, collect);
  }

  if (isString(collect)) return `${key}` + collect;

  if (isArray(collect)) {
    if (isArray(key)) collect.unshift(...key);
    else collect.unshift(key);
    return collect;
  }

  if (isObject(collect)) {
    // Keys keep their insertion order, so the rest is taken out and put back after the new key
    const rest = { ...collect };
    for (const name of Object.keys(rest)) delete collect[name];
    collect[key] = value;
    return Object.assign(collect, rest);
  }

  return fail('prepend', collect);
}

/**
 * Adds an element to a collection or updates a key-value pair in an object.
 *
 * @param {*} key - The key or element to add to the collection or object.
 * @param {*} value - The value to add to the collection or object.
 * @param {Array|Object|Promise} collect - The collection or object to which the key-value pair or element is added.
 * @returns {Array|Object|Promise} Returns the updated collection or object.
 */
export function push(key, value, collect) {
  const count = arguments.length;
  if (count === 1) return collect => push(key, 0, collect);
  if (count === 2) {
    if (isArray(value) || isNil(value)) return push(key, 0, value);
    if (isPromise(value)) return value.then(v => push(key, 0, v));
    return collect => push(key, value, collect);
  }

  if (isArray(collect)) {
    if (value == 1) collect.push(...key);
    else collect.push(key);
    return collect;
  }

  if (isObject(collect)) {
    collect[key] = value;
    return collect;
  }

  if (isPromise(collect)) return collect.then(c => push(key, value, c));
  return fail('push', collect);
}

/**
 * Reduces a collection to a single value by applying a function to each element. Without a
 * seed the first element starts the reduction, as in `Array.prototype.reduce`; an empty
 * collection without a seed gives `undefined`.
 *
 * @param {Function|Array} fn - The function to apply to each element or an array containing [fn, seed].
 * @param {*} [seed] - The initial value or collection to start the reduction.
 * @param {Array|Object} [collect] - The collection to reduce.
 * @returns {*} Returns the reduced value.
 */
export function reduce(fn, seed, collect) {
  const count = arguments.length;
  if (count === 1) {
    if (isArray(fn)) return collect => reduce(fn[0], fn[1], collect);
    return collect => reduce(fn, collect);
  }
  if (count === 2) {
    if (isArray(fn)) return reduce(fn[0], fn[1], seed);
    collect = seed;
  }

  const seeded = count > 2;

  if (isArray(collect)) {
    let index = 0;
    let result = seeded ? seed : collect[index++];
    for (; index < collect.length; index++) result = fn(result, collect[index], index, collect);
    return result;
  }

  if (isObject(collect)) {
    const names = Object.keys(collect);
    let index = 0;
    let result = seeded ? seed : collect[names[index++]];
    for (; index < names.length; index++) {
      result = fn(result, collect[names[index]], names[index]);
    }
    return result;
  }

  return fail('reduce', collect);
}

/**
 * Removes specified keys from a collection, in place. In an array the items at the given
 * indexes are taken out and the rest move up, so no empty slots are left behind.
 * @param {Array|string|number} keys - The keys, or array indexes, to be removed from the collection.
 * @param {Object|Array} [collect] - The collection from which keys are to be removed.
 * @returns {Object|Array|Function} - The modified collection with the keys removed.
 */
export function remove(keys, collect) {
  if (arguments.length < 2) return collect => remove(keys, collect);
  if (isPromise(collect)) return collect.then(c => remove(keys, c));
  if (!isCollect(collect)) return fail('remove', collect);

  if (isArray(collect)) {
    // From the highest index down, so removing one item does not shift the ones still to go
    const indexes = [...new Set(isArray(keys) ? keys : [keys])].sort((a, b) => b - a);
    for (let i = 0; i < indexes.length; i++) {
      const index = Number(indexes[i]);
      if (isInteger(index) && index >= 0 && index < collect.length) collect.splice(index, 1);
    }
    return collect;
  }

  if (isArray(keys)) {
    for (let index = 0; index < keys.length; index++) delete collect[keys[index]];
  } else {
    delete collect[keys];
  }

  return collect;
}

/**
 * Reverses the order of elements in an array, in place.
 *
 * @param {*} collect - The array to reverse.
 * @returns {*} Returns the same array with its elements reversed.
 */
export function reverse(collect) {
  if (!arguments.length) return collect => reverse(collect);
  if (isArray(collect)) return collect.reverse();
  return fail('reverse', collect);
}

/**
 * Removes and returns the first item from the collection.
 *
 * @param {number} [count] - The number of elements to shift.
 * @param {Array|Promise} [collect] - The collection or a promise that resolves to a collection.
 * @returns {Function|any|null} If the collection is an array, returns the shifted elements.
 */
export function shift(count, collect) {
  const args = arguments.length;
  if (!args) return collect => shift(void 0, collect);
  if (args === 1) {
    if (isNumber(count)) return collect => shift(count, collect);
    return shift(void 0, count);
  }

  if (isPromise(collect)) return collect.then(c => shift(count, c));
  if (isUndefined(count)) count = 1;

  // TODO: object support
  if (!isArray(collect)) return fail('shift', collect);
  return count === 1 ? collect.shift() : collect.splice(0, count);
}

/**
 * Extracts a section of an array based on the provided starting index and optional limit.
 *
 * @param {(number|number[])} key - The starting index or an array containing [start, limit].
 * @param {*} collect - The array to extract a section from.
 * @returns {*} Returns a new array containing the extracted section.
 */
export function slice(key, collect) {
  if (arguments.length < 2) return collect => slice(key, collect);
  if (!isArray(collect)) return fail('slice', collect);

  const [index, limit, segment] = isArray(key) ? key : [key];

  if (!isUndefined(segment)) return collect.slice(index).slice(0, limit);
  return collect.slice(index, limit);
}

/**
 * Determines whether the collection contains a given item
 * @param {string|Function} key - The key to check or a function to apply to each item in the collection.
 * @param {*} value - The value to match (optional).
 * @param {Array|Object} collect - The collection to search.
 * @returns {boolean|Function} - Returns true if the condition is met, otherwise false.
 */
export function some(key, value, collect) {
  const count = arguments.length;
  if (count === 1) return collect => some(key, void 0, collect);
  if (count === 2) {
    if (isPromise(value)) return value.then(v => some(key, void 0, v));
    if (isCollect(value) || isNil(value)) return some(key, void 0, value);
    return collect => some(key, value, collect);
  }

  if (isPromise(key)) return key.then(k => some(k, value, collect));
  if (isPromise(value)) return value.then(v => some(key, v, collect));
  if (isPromise(collect)) return collect.then(c => some(key, value, c));
  if (!isCollect(collect)) return fail('some', collect);

  const list = isArray(collect);

  if (!isUndefined(value)) {
    // Check if the key-value pair exists in an array of objects, or in an object
    if (!list) return collect[key] === value;
    for (let index = 0; index < collect.length; index++) {
      const item = collect[index];
      if (!isNil(item) && item[key] === value) return true;
    }
    return false;
  }

  if (isFunction(key)) {
    // Check if any item in the collection satisfies the condition provided by the function
    if (list) {
      for (let index = 0; index < collect.length; index++) {
        if (key(collect[index], index)) return true;
      }
      return false;
    }
    for (const name of Object.keys(collect)) {
      if (key(collect[name], name)) return true;
    }
    return false;
  }

  // Check if a value exists in an array, or a key or a value exists in an object
  if (list) return collect.indexOf(key) !== -1;
  return Object.keys(collect).indexOf(key) !== -1 || Object.values(collect).indexOf(key) !== -1;
}

/**
 * Sorts a collection in place, based on the provided comparator function. Without one, numbers
 * are sorted by value and everything else alphabetically.
 *
 * @param {Function|Array} [fn] - Comparator function to determine the order of elements.
 * @param {Array} [collect] - The collection of elements to sort.
 * @returns {Array} - The sorted collection.
 */
export function sort(fn, collect) {
  const count = arguments.length;
  if (!count || (count === 1 && isFunction(fn))) return collect => sort(fn, collect);
  if (count === 1) return sort(void 0, fn);
  if (!isArray(collect)) return fail('sort', collect);

  if (!isUndefined(fn)) return collect.sort(fn);
  if (collect.every(item => isNumber(item))) return collect.sort((a, b) => a - b);
  return collect.sort();
}

/**
 * Changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.
 *
 * @param {*} key - The starting index or an array containing [start, deleteCount, items].
 * @param {*} collect - The array to modify.
 * @returns {*} Returns an array with the removed elements.
 */
export function splice(key, collect) {
  if (arguments.length < 2) return collect => splice(key, collect);

  const [index, limit, replace] = isArray(key) ? key : [key];

  if (isArray(collect)) {
    if (isUndefined(limit) && isUndefined(replace)) return collect.splice(index);
    if (isUndefined(replace)) return collect.splice(index, limit);
    return collect.splice(index, limit, ...replace);
  }

  if (isPromise(collect)) return collect.then(c => splice(key, c));
  return fail('splice', collect);
}

/**
 * Splits a string by a delimiter, or an array into a number of groups. Groups are filled as
 * evenly as possible and the array is left untouched.
 *
 * @param {string|number} key - The delimiter for splitting strings or the number of groups.
 * @param {Array|string} [collect] - The collection to be split.
 * @returns {Array|string|Function} - An array of split groups if the collection is provided.
 */
export function split(key, collect) {
  if (arguments.length < 2) return collect => split(key, collect);
  if (isPromise(collect)) return collect.then(c => split(key, c));

  if (isString(collect)) return collect.split(key);
  if (!isArray(collect)) return fail('split', collect);

  const collection = [];
  const total = collect.length;
  const perGroup = Math.floor(total / key);
  const extra = total % key;
  let start = 0;

  for (let group = 0; group < key && start < total; group++) {
    const end = start + perGroup + (group < extra ? 1 : 0);
    collection.push(collect.slice(start, end));
    start = end;
  }

  return collection;
}

/**
 * Takes a specified number of elements from a collection.
 *
 * @param {number} count - Number of elements to take. If negative, takes from the end.
 * @param {Array|Object} [collect] - Collection to take from.
 * @returns {Function|Array|Object} Function if `collect` is undefined, otherwise sliced collection.
 */
export function take(count, collect) {
  if (arguments.length < 2) return collect => take(count, collect);

  if (isArray(collect)) return count < 0 ? collect.slice(count) : collect.slice(0, count);

  if (isObject(collect)) {
    const names = Object.keys(collect);
    const collection = {};
    for (const name of count < 0 ? names.slice(count) : names.slice(0, count)) {
      collection[name] = collect[name];
    }
    return collection;
  }

  return fail('take', collect);
}

/**
 * Returns items in the collection until the given callback returns `true`
 *
 * @param {Function|any} fn - Condition function or value to stop taking elements.
 * @param {Array|Object} [collect] - Collection to take from.
 * @returns {Function|Array|Object} Function if `collect` is undefined, otherwise filtered collection.
 */
export function takeUntil(fn, collect) {
  if (arguments.length < 2) return collect => takeUntil(fn, collect);

  const stop = isFunction(fn) ? fn : value => value === fn;

  if (isArray(collect)) {
    let index = 0;
    while (index < collect.length && !stop(collect[index])) index++;
    return collect.slice(0, index);
  }

  if (isObject(collect)) {
    const collection = {};
    for (const key of Object.keys(collect)) {
      if (stop(collect[key])) break;
      collection[key] = collect[key];
    }
    return collection;
  }

  return fail('takeUntil', collect);
}

/**
 * Returns a collection of unique items from the given collection.
 * @param {Function|string} key - The key function or key name to determine uniqueness.
 * @param {Array} [collect] - The collection to filter for unique items.
 * @returns {Array|Function} - The filtered collection of unique items.
 */
export function unique(key, collect) {
  const count = arguments.length;
  if (!count) return collect => unique(void 0, collect);
  if (count === 1) {
    if (isCollect(key) || isNil(key)) return unique(void 0, key);
    return collect => unique(key, collect);
  }
  if (!isArray(collect)) return fail('unique', collect);

  if (isUndefined(key)) return [...new Set(collect)];

  const used = new Set();
  const read = isFunction(key) ? key : item => item[key];
  const result = [];
  for (let index = 0; index < collect.length; index++) {
    const id = read(collect[index]);
    if (used.has(id)) continue;
    used.add(id);
    result.push(collect[index]);
  }
  return result;
}

/**
 * Executes a function with the provided collection and returns the original collection.
 *
 * @param {Function} fn - Function to execute with the collection.
 * @param {Array|Object} [collect] - Collection to pass to the function.
 * @returns {Function|Array|Object} Function if `collect` is undefined, otherwise the original collection.
 */
export function tap(fn, collect) {
  if (arguments.length < 2) return collect => tap(fn, collect);
  fn(collect);
  return collect;
}

/**
 * Retrieves the value of a specified key from a collection. A dot-separated key reaches into
 * nested values, and stops with `undefined` or `null` as soon as a level is missing.
 *
 * @param {string} key - The key whose value is to be retrieved.
 * @param {Object|Array} [collect] - The collection from which to retrieve the value.
 * @returns {*} - The value(s) corresponding to the key.
 */
export function value(key, collect) {
  if (arguments.length < 2) return collect => value(key, collect);
  if (isPromise(collect)) return collect.then(c => value(key, c));
  if (isNil(collect)) return fail('value', collect);

  if (isArray(collect)) {
    const result = new Array(collect.length);
    for (let index = 0; index < collect.length; index++) result[index] = value(key, collect[index]);
    return result;
  }

  if (!isString(key) || key.indexOf('.') === -1) return collect[key];

  // Splits a dot-separated key and accesses the nested property in an object.
  const path = key.split('.');
  for (let p = 0; p < path.length && !isNil(collect); p++) collect = collect[path[p]];
  return collect;
}

/**
 * Returns an array containing the values of the specified collection.
 *
 * @param {Array|Object|Promise} [collect] - The collection to extract values from.
 * @returns {Array} Returns an array of values.
 */
export function values(collect) {
  if (!arguments.length) return collect => values(collect);
  if (isArray(collect)) return collect;
  if (isObject(collect)) return Object.values(collect);
  if (isPromise(collect)) return collect.then(c => values(c));
  return fail('values', collect);
}

/**
 * Iterates over an array, object, or promise and applies `fn` to each element.
 *
 * @param {Function} fn - The function to apply.
 * @param {boolean} [stop] - Optional stop condition.
 * @param {Array|Object|Promise} collect - The collection to iterate over.
 * @returns {void|Promise<void>}
 */
export function walk(fn, stop, collect) {
  const count = arguments.length;
  if (count === 1) return collect => walk(fn, false, collect);
  if (count === 2) {
    if (isBoolean(stop)) return collect => walk(fn, stop, collect);
    return walk(fn, false, stop);
  }

  if (isArray(collect)) {
    return iterate(
      isAsync(fn)
        ? async index => {
            const result = await fn(collect[index], index);
            return result;
          }
        : index => {
            const result = fn(collect[index], index);
            return result;
          },
      stop,
      length(collect)
    );
  } else if (isObject(collect)) {
    const object = keys(collect);
    return iterate(
      isAsync(fn)
        ? async index => {
            const key = object[index];
            const value = collect[key];
            const result = await fn(key, value, index);
            return result;
          }
        : index => {
            const key = object[index];
            const value = collect[key];
            const result = fn(key, value, index);
            return result;
          },
      stop,
      length(object)
    );
  } else if (isPromise(collect)) return collect.then(c => walk(fn, stop, c));
  return fail('walk', collect);
}
