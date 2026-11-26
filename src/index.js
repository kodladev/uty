/**
  Helpers
  --------------------------------------------------------------------------------------------------
  Utilities for common task snippets.
  --------------------------------------------------------------------------------------------------
*/

import { isArray, isFunction, isPromise } from './is.js';

/**
 * It's a structure that connects functions by passing the output of one function as the arguments
 * to another function. A step can also be an array of functions. When the data, or the result of
 * any step, is a Promise, the remaining steps wait for it and the result is a Promise.
 *
 * @param {Array|Object|Promise|Function} collect - The collection to pipe.
 * @param {...Function} fns - The functions to pipe the collection through.
 * @returns {*} - Returns the result of piping the collection through the functions.
 */
export function pipe(collect, ...fns) {
  if (isFunction(collect)) return c => pipe(c, collect, ...fns);
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i];
    if (isArray(fn)) collect = pipe(collect, ...fn);
    else if (!isFunction(fn)) throw new TypeError('uty: pipe expects functions as its steps');
    else collect = isPromise(collect) ? collect.then(fn) : fn(collect);
  }
  return collect;
}

/**
 * Creates a deep copy of a collection using the structured cloning algorithm.
 *
 * @param {Array|Object} collect - The collection to clone.
 * @returns {Array|Object} - Returns the cloned collection.
 */
export function clone(collect) {
  return structuredClone(collect);
}

/**
 * Converts a synchronous function to return a Promise.
 *
 * @param {Function} fn - The function to convert.
 * @returns {Function} A function that returns a Promise.
 */
export function prom(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      try {
        const result = fn(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
}
