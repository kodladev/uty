/**
  Mathematical Operations
  --------------------------------------------------------------------------------------------------
  Tools designed to facilitate mathematical operations.
  --------------------------------------------------------------------------------------------------
*/

import { every, filter, keys, map, pluck } from './collect.js';
import { fail } from './fail.js';
import {
  isArray,
  isArrayLike,
  isCollect,
  isDivisible,
  isFunction,
  isNumber,
  isObject,
  isPromise,
  isString,
  isUndefined,
} from './is.js';

/**
 * Combines two values. Works with numbers, strings, and collections.
 * @param {number|string} a - The first value to add.
 * @param {number|string|Array} [b] - The second value to add or a collection to map.
 * @returns {Function|number|string|Array} The sum of the values, or a mapped collection.
 */
export function add(a, b) {
  if (arguments.length < 2) return b => add(a, b);
  if ((isNumber(a) && isNumber(b)) || (isString(a) && isString(b))) return a + b;
  if (isCollect(b)) return map(item => add(a, item), b);
  return fail('add', b);
}

/**
 * Calculates the average of a set of values. You can also average a specific key or the result
 * of a function applied to each element.
 *
 * @param {string|Function} [key] - The key to pluck or the function to map over the collection.
 * @param {Array} [collect] - The collection to average.
 * @returns {number} The average of the collection.
 */
export function avg(key, collect) {
  const count = arguments.length;
  if (!count) return collect => avg(void 0, collect);
  if (count === 1) {
    if (isString(key) || isFunction(key)) return collect => avg(key, collect);
    return avg(void 0, key);
  }

  return sum(key, collect) / size(collect);
}

/**
 * Filters a collection to include only items divisible by a given number or numbers.
 *
 * @param {number|Array<number>} number - The number or array of numbers to check divisibility against.
 * @param {Array|Object} [collect] - The collection to filter.
 * @returns {Array|Object} The filtered collection.
 */
export function divisible(number, collect) {
  if (arguments.length < 2) return collect => divisible(number, collect);
  if (!isCollect(collect)) return fail('divisible', collect);
  if (isArray(number)) {
    return filter(item => every(num => isDivisible(item, num), number), collect);
  }
  return filter(item => isDivisible(item, number), collect);
}

/**
 * Returns the size of the specified collection.
 *
 * @param {*} [collect] - The collection to determine the size of.
 * @returns {number} Returns the size of the collection.
 */
export function size(collect) {
  if (!arguments.length) return collect => size(collect);
  if (isArrayLike(collect)) return length(collect);
  if (isObject(collect)) return length(keys(collect));
  if (collect?.size) return collect.size;
  if (isPromise(collect)) return collect.then(c => size(c));
  return 0;
}

/**
 * Returns the length of an array or array-like object.
 *
 * @private
 * @param {Array|String} collect - The array or array-like object.
 * @returns {number} - Returns the length of the array or array-like object.
 */
export function length(collect) {
  return collect.length;
}

/**
 * Calculates the sum of a collection. Optionally sums the values of a specified key or the result
 * of a function applied to each element. Whole totals are exact; a total with a fraction is
 * rounded to 12 significant digits.
 *
 * @param {string|Function} [key] - The key to pluck or the function to map over the collection.
 * @param {Array|Object} [collect] - The collection to sum.
 * @returns {number} The sum of the collection.
 */
export function sum(key, collect) {
  const count = arguments.length;
  if (!count) return collect => sum(void 0, collect);
  if (count === 1) {
    if (isString(key) || isFunction(key)) return collect => sum(key, collect);
    return sum(void 0, key);
  }

  const items = isArray(collect) ? collect : isObject(collect) ? Object.values(collect) : null;
  if (!items) return fail('sum', collect);

  let total = 0;

  if (isFunction(key)) {
    // Sum the results of the function applied to each element
    for (let i = 0; i < items.length; i++) total += key(items[i], i);
  } else {
    // Sum the collection directly, or the values plucked for the specified key
    const numbers = isUndefined(key) ? items : pluck(key, void 0, items);
    for (let i = 0; i < numbers.length; i++) total += numbers[i];
  }

  // Whole numbers are exact; fractions are rounded to hide floating point noise (0.1 + 0.2)
  return Number.isInteger(total) ? total : parseFloat(total.toPrecision(12));
}
