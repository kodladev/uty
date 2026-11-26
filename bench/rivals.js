/**
  Benchmark Rivals
  --------------------------------------------------------------------------------------------------
  The pipe from the README, written the way each library asks for it: keep some items, change
  them, add them up.

  Every function takes the data and the two callbacks as arguments. A real program hands a
  library many different callbacks, and the engine can only speed up a call that always meets
  the same function; taking the callbacks as arguments puts every library in that position.
  --------------------------------------------------------------------------------------------------
*/

import lodash from 'lodash';
import * as radash from 'radash';
import * as ramda from 'ramda';
import * as remeda from 'remeda';
import { filter, map } from '../src/collect.js';
import { pipe } from '../src/index.js';
import { sum } from '../src/math.js';

const add = (total, number) => total + number;

/** Keep, change, add up: one function per library, all with the same arguments. */
export const rivals = {
  uty: (data, keep, change) => pipe(data, filter(keep), map(change), sum),
  remeda: (data, keep, change) =>
    remeda.pipe(data, remeda.filter(keep), remeda.map(change), remeda.sum()),
  // radash filters and maps in one call
  radash: (data, keep, change) => radash.sum(radash.select(data, change, keep)),
  lodash: (data, keep, change) => lodash.sum(lodash.map(lodash.filter(data, keep), change)),
  ramda: (data, keep, change) => ramda.pipe(ramda.filter(keep), ramda.map(change), ramda.sum)(data),
  'plain JavaScript': (data, keep, change) => data.filter(keep).map(change).reduce(add, 0),
};

/** The callbacks of the README example. */
export const keep = n => n > 1;
export const change = n => n * 2;

/**
 * Other callbacks, given to every library before it is timed, so each one has met more than
 * one function, as it would in an application.
 */
export const others = [
  [n => n < 4, n => n + 1],
  [n => n % 2, n => `${n}`.length],
  [n => !!n, n => n - 1],
  [n => n !== 3, n => n / 2],
];
