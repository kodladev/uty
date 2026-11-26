/**
  Type Utilities
  --------------------------------------------------------------------------------------------------
  Shared type definitions, written as JSDoc so the source stays plain JavaScript.
  The module has no runtime content; the published `.d.ts` files are generated from these typedefs.
  --------------------------------------------------------------------------------------------------
*/

/**
 * Type representing an array or a readonly array.
 * @template [K=unknown] - The type of elements in the array.
 * @typedef {K[] | Readonly<K[]>} $array
 */

/**
 * Type representing either an array or an object literal with keys of type
 * string or number, and values of type K or an array of K.
 * @template [K=unknown] - The type of values in the array or object literal.
 * @typedef {$array<K> | $object<K>} $collect
 */

/**
 * Type representing an object literal with keys of type string or number, and
 * values of type K or an array of K.
 * @template [K=unknown] - The type of values in the object literal.
 * @typedef {ObjectLiteral<K>} $object
 */

/**
 * Represents a type that behaves like an array by having a 'length' property.
 * @typedef {{ readonly length: number }} ArrayLikeLiteral
 */

/**
 * Alias to create a function.
 * @template {List} [K=any] - The type of parameters.
 * @template [D=any] - The return type.
 * @typedef {(...args: K) => D} Arrow
 */

/**
 * Alias to create a async function.
 * @template {List} [K=any[]] - The type of parameters.
 * @template [D=any] - The return type.
 * @typedef {Arrow<K, Promise<D>>} AsyncArrow
 */

/**
 * Type representing a class constructor that takes arguments of type K and
 * creates an instance of type D.
 * @template [K=any] - The type of arguments the class constructor takes.
 * @template [D=any] - The type of the class instance.
 * @typedef {new (...args: K[]) => D} ClassLiteral
 */

/**
 * Type that checks if type `K` extends type `D`, and returns type `K` if true,
 * otherwise returns `never`.
 * @template K - The type to be checked.
 * @template D - The type to check against.
 * @typedef {K extends D ? K : never} Include
 */

/**
 * Alias representing a readonly array.
 * @template [K=any] - The type of elements in the list.
 * @typedef {ReadonlyArray<K>} List
 */

/**
 * Type representing an object literal with keys of type string or number,
 * and values of type K or an array of K.
 * @template K - The type of values in the object literal.
 * @typedef {{ [key: string | number]: K | K[] }} ObjectLiteral
 */

/**
 * Extract the return type of a function.
 * @template {Arrow} K - The arrow function type.
 * @typedef {K extends (...args: List) => infer N ? N : never} Return
 */

/**
 * Represents JavaScript's primitive types.
 * @typedef {string | number | boolean | null | undefined | symbol | bigint} Primitive
 */

export {};
