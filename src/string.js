/**
  String Tools
  --------------------------------------------------------------------------------------------------
  Tools for easy string manipulation and formatting.
  --------------------------------------------------------------------------------------------------
*/

import { dot, includes, merge, some } from './collect.js';
import { RAW_EMPTY, RAW_WHITESPACE } from './define.js';
import { fail } from './fail.js';
import { isArray, isNil, isString, isUndefined } from './is.js';
import { length } from './math.js';

/**
 * Decides what a single argument is for the functions that take an optional locale first:
 * a string is the text itself, a missing value is a mistake, anything else is a locale.
 *
 * @private
 * @param {string} name - The name of the calling function.
 * @param {Function} fn - The calling function.
 * @param {*} locale - The only argument that was passed.
 * @returns {string|string[]|Function} The result, or a function awaiting the string.
 */
function single(name, fn, locale) {
  if (isString(locale)) return fn(void 0, locale);
  if (isNil(locale)) return fail(name, locale);
  return collect => fn(locale, collect);
}

/**
 * Converts the given string to lowercase, optionally using a specified locale.
 *
 * @param {string|undefined} locale - The locale to use for the conversion (optional).
 * @param {string|undefined} collect - The string to convert to lowercase.
 * @returns {string|function} The lowercase string or a function awaiting the string.
 */
export function lower(locale, collect) {
  const count = arguments.length;
  if (!count) return collect => lower(void 0, collect);
  if (count === 1) return single('lower', lower, locale);
  if (!isString(collect)) return fail('lower', collect);

  if (!isUndefined(locale)) {
    return collect.toLocaleLowerCase(locale);
  } else {
    return collect.toLowerCase();
  }
}

/**
 * Removes punctuation characters from a string.
 *
 * @param {string|undefined} collect - The string from which to remove punctuation.
 * @returns {string|function} The string without punctuation, or a function awaiting the string.
 */
export function removePunct(collect) {
  if (!arguments.length) return collect => removePunct(collect);
  if (!isString(collect)) return fail('removePunct', collect);

  // Regular expression to match punctuation characters
  const punctRgx = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g;

  // Replace punctuation characters with an empty string
  return collect.replace(punctRgx, RAW_EMPTY);
}

/**
 * Extracts a substring from a given string or strings within a collection.
 *
 * @param {number} start - The starting index of the substring.
 * @param {number|undefined} end - The ending index of the substring (optional).
 * @param {string|Array|string} collect - The string or collection to extract substrings from.
 * @returns {string|function} The extracted substring or a function awaiting the collection.
 */
export function sub(start = 1, end, collect) {
  const count = arguments.length;
  if (count < 3) {
    if (isString(end)) return sub(start, void 0, end);
    if (isString(start)) return sub(1, void 0, start);
    // The last of several arguments is the text; a missing one is a mistake
    if (count && isNil(arguments[count - 1])) return fail('sub', arguments[count - 1]);
    return collect => sub(start, end, collect);
  }
  if (!isString(collect)) return fail('sub', collect);

  if (end) return collect.substring(start, end);
  return collect.substring(start);
}

/**
 * Replaces placeholders in a string with values from an object or tree.
 *
 * @param {string|Object} str - The string with placeholders (e.g., "{key}").
 * @param {Array<string>|undefined} [holders] - A list of opening and closing delimiters for placeholders.
 * @param {Object|undefined} [collect] - The object containing replacement values.
 * @returns {string|Function} - The string with placeholders replaced by corresponding values.
 */
export function supplant(str, holders, collect) {
  const count = arguments.length;
  if (count < 3) {
    if (!isString(str)) {
      if (isNil(str)) return fail('supplant', str);
      return collect => supplant(collect, holders, str);
    }
    if (count === 1) return collect => supplant(str, void 0, collect);
    if (isArray(holders)) return collect => supplant(str, holders, collect);
    return supplant(str, void 0, holders);
  }
  if (isNil(collect)) return fail('supplant', collect);

  const rgx = holders
    ? new RegExp(`${escape(holders[0])}(.*?)${escape(holders[1])}`, 'g')
    : /{(.*?)}/g;
  return str.replace(rgx, (_, key) => {
    const value = dot(key, void 0, collect);
    return isNil(value) ? RAW_EMPTY : value;
  });
}

/**
 * Escapes the characters that have a meaning in a regular expression.
 *
 * @private
 * @param {string} text - The text to match literally.
 * @returns {string} The escaped text.
 */
function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts the first character of a string to uppercase, considering locale if provided.
 *
 * @param {string|undefined} locale - The locale to use for uppercasing the first character.
 * @param {string|undefined} collect - The string to convert.
 * @returns {string|function} The string with the first character in uppercase, or a function awaiting the string.
 */
export function ucfirst(locale, collect) {
  const count = arguments.length;
  if (!count) return collect => ucfirst(void 0, collect);
  if (count === 1) return single('ucfirst', ucfirst, locale);
  if (!isString(collect)) return fail('ucfirst', collect);

  return upper(locale, collect.substring(0, 1)) + collect.substring(1);
}

/**
 * Converts the first character of each word in a string to uppercase, considering locale if provided.
 *
 * @param {string|undefined} locale - The locale to use for uppercasing characters.
 * @param {string|undefined} collect - The string to convert.
 * @returns {string|function} The string with each word's first character in uppercase, or a function awaiting the string.
 */
export function ucwords(locale, collect) {
  const count = arguments.length;
  if (!count) return collect => ucwords(void 0, collect);
  if (count === 1) return single('ucwords', ucwords, locale);
  if (!isString(collect)) return fail('ucwords', collect);

  return words(0, lower(locale, collect))
    .map(word => ucfirst(locale, word))
    .join(RAW_WHITESPACE);
}

/**
 * Converts the given string to uppercase, optionally using a specified locale.
 *
 * @param {string|undefined} locale - The locale to use for the conversion (optional).
 * @param {string|undefined} collect - The string to convert to uppercase.
 * @returns {string|function} The uppercase string or a function awaiting the string.
 */
export function upper(locale, collect) {
  const count = arguments.length;
  if (!count) return collect => upper(void 0, collect);
  if (count === 1) return single('upper', upper, locale);
  if (!isString(collect)) return fail('upper', collect);

  if (!isUndefined(locale)) {
    return collect.toLocaleUpperCase(locale);
  } else {
    return collect.toUpperCase();
  }
}

/**
 * Checks text against options.
 *
 * This function checks if the text meets the specified criteria, such as length, case,
 * and character type. It returns an array of criteria that the text satisfies.
 *
 * @param {string} text - Text to validate.
 * @param {Object} [options] - An object with the validation options.
 * @param {number} [options.minimum] - The minimum length the text must have.
 * @param {number} [options.maximum] - The maximum length the text must have.
 * @param {number} [options.lowercase] - The minimum number of lowercase letters required in the text.
 * @param {number} [options.uppercase] - The minimum number of uppercase letters required in the text.
 * @param {number} [options.special] - The minimum number of special characters (punctuation and symbols) required in the text.
 * @param {number} [options.number] - The minimum number of numeric digits required in the text.
 * @param {Array<string>} [options.disable] - An array of forbidden words that cannot be part of the text
 * @param {Array<string>} [options.require] - An array of required words that must be present in the text.
 * @returns {Array<string>} An array of criteria that the text passes (e.g., ['minimum', 'lowercase', 'number']).
 */
export function validate(text, options = {}) {
  options = merge(options, {
    minimum: 0,
    maximum: Infinity,
    lowercase: 0,
    uppercase: 0,
    special: 0,
    number: 0,
    require: 0,
    disable: 0,
  });

  let used = [];
  const { minimum, maximum, lowercase, uppercase, special, number, disable } = options;

  // Each rule counts the characters of one kind; punctuation and symbols are both special
  const rules = [
    ['lowercase', lowercase, /\p{Ll}/gu],
    ['uppercase', uppercase, /\p{Lu}/gu],
    ['special', special, /[\p{P}\p{S}]/gu],
    ['number', number, /\p{N}/gu],
  ];

  const len = length(text);
  if (len >= minimum) used.push('minimum');
  if (len <= maximum) used.push('maximum');

  for (const [name, required, rgx] of rules) {
    if (required > 0 && length(text.match(rgx) || []) >= required) used.push(name);
  }

  if (options.require || disable) {
    const textLower = lower(text);
    const check = some(word => includes(lower(word), textLower));
    if (options.require && check(options.require)) used.push('require');
    if (disable && check(disable)) used.push('disable');
  }

  return used;
}

/**
 * Splits a string into an array of words, optionally removing punctuation.
 *
 * @param {number|undefined} punct - A flag indicating whether to remove punctuation (1 to remove, 0 to keep).
 * @param {string|undefined} collect - The string to split into words.
 * @returns {string[]|function} An array of words or a function awaiting the string.
 */
export function words(punct, collect) {
  const count = arguments.length;
  if (!count) return collect => words(0, collect);
  if (count === 1) {
    if (isString(punct)) return words(0, punct);
    if (isNil(punct)) return fail('words', punct);
    return collect => words(punct, collect);
  }
  if (!isString(collect)) return fail('words', collect);

  // Regular expression to match non-space sequences
  const nonSpaceRgx = /\S+/g;

  // If punct is truthy, remove punctuation and match non-space sequences
  if (punct) {
    return removePunct(collect).match(nonSpaceRgx) || [];
  } else {
    // Otherwise, match non-space sequences without removing punctuation
    return collect.match(nonSpaceRgx) || [];
  }
}
