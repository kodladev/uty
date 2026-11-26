/**
  Failure
  --------------------------------------------------------------------------------------------------
  The one error every function raises when it is handed data it cannot work with.
  --------------------------------------------------------------------------------------------------
*/

/**
 * Throws a `TypeError` that names the function and the kind of data it received.
 *
 * Leaving an argument out returns a function that waits for it; passing data that cannot be
 * processed ends here, so the mistake shows up where it happens.
 *
 * @private
 * @param {string} name - The name of the function that received the data.
 * @param {*} value - The data that could not be processed.
 * @returns {never}
 */
export function fail(name, value) {
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  throw new TypeError(`uty: ${name} cannot work with ${type}`);
}
