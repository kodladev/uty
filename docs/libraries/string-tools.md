# String Tools

Tools for easy string manipulation and formatting.

## Import

```js
import { ucfirst, ucwords } from 'uty/string';
```

## Functions

### `lower`

Converts a string to lowercase. Pass a locale first to follow that language's rules.

**Example**

```js
lower('HELLO World');
//=> 'hello world'
```

```js
lower('tr', 'ISPARTA');
//=> 'ısparta'
```

```js
map(lower(), ['A', 'B']);
//=> ['a', 'b']
```

> [!NOTE]
> A single string is always the text, so `lower('tr')` returns `'tr'`. To get a function that waits for the text with a locale already set, pass the locale as an array:
>
> ```js
> const lowerTurkish = lower(['tr']);
> lowerTurkish('ISPARTA');
> //=> 'ısparta'
> ```
>
> The same goes for `upper`, `ucfirst` and `ucwords`.

---

### `removePunct`

Removes punctuation characters from a string.

**Example**

```js
removePunct('Hello, world!');
//=> 'Hello world'
```

```js
removePunct("it's 50% off (today)");
//=> 'its 50 off today'
```

---

### `sub`

Extracts a part of a string, from a start index up to an optional end index. Without a start index it drops the first character.

**Example**

```js
sub('Lorem');
//=> 'orem'
```

```js
sub(2, 'Lorem');
//=> 'rem'
```

```js
sub(1, 3, 'Lorem');
//=> 'or'
```

```js
pipe('Lorem', sub(1, 3));
//=> 'or'
```

---

### `supplant`

Replaces the placeholders in a string with values from an object. A placeholder can reach a nested value with a dot-separated key.

**Example**

```js
supplant('Hello {name}', { name: 'Ada' });
//=> 'Hello Ada'
```

```js
supplant('{user.name} has {count} messages', { user: { name: 'Ada' }, count: 0 });
//=> 'Ada has 0 messages'
```

A placeholder without a value is removed.

```js
supplant('Hello {name}{title}', { name: 'Ada' });
//=> 'Hello Ada'
```

The second argument can set other delimiters.

```js
supplant('Hello {{name}}', ['{{', '}}'], { name: 'Ada' });
//=> 'Hello Ada'
```

Leaving out either side returns a function that waits for it.

```js
const greet = supplant('Hello {name}');
greet({ name: 'Ada' });
//=> 'Hello Ada'
```

```js
const forAda = supplant({ name: 'Ada' });
forAda('Hello {name}');
//=> 'Hello Ada'
```

---

### `ucfirst`

Converts the first character of a string to uppercase and leaves the rest as it is. Pass a locale first to follow that language's rules.

**Example**

```js
ucfirst('uty is simple');
//=> 'Uty is simple'
```

```js
ucfirst('tr', 'istanbul');
//=> 'İstanbul'
```

---

### `ucwords`

Converts the first character of every word to uppercase and the rest to lowercase. Extra spaces between words are dropped.

**Example**

```js
ucwords('uty is simple');
//=> 'Uty Is Simple'
```

```js
ucwords('UTY IS simple');
//=> 'Uty Is Simple'
```

```js
ucwords('tr', 'ilk iş');
//=> 'İlk İş'
```

---

### `upper`

Converts a string to uppercase. Pass a locale first to follow that language's rules.

**Example**

```js
upper('hello');
//=> 'HELLO'
```

```js
upper('tr', 'izmir');
//=> 'İZMİR'
```

---

### `validate`

Checks a text against a set of rules and returns the names of the rules it meets. It is a good fit for password policies: compare the result with the rules you asked for.

| Rule        | Met when the text                                                 |
| ----------- | ----------------------------------------------------------------- |
| `minimum`   | has at least this many characters (default `0`)                   |
| `maximum`   | has at most this many characters (default `Infinity`)             |
| `lowercase` | has at least this many lowercase letters                          |
| `uppercase` | has at least this many uppercase letters                          |
| `number`    | has at least this many digits                                     |
| `special`   | has at least this many punctuation or symbol characters           |
| `require`   | contains one of the given words, ignoring case                    |
| `disable`   | contains one of the given words, ignoring case (a word to reject) |

**Example**

```js
validate('HelloWorld123!', {
  minimum: 8,
  maximum: 15,
  lowercase: 2,
  uppercase: 2,
  special: 1,
  number: 2,
});
//=> ['minimum', 'maximum', 'lowercase', 'uppercase', 'special', 'number']
```

```js
validate('password', { minimum: 8, uppercase: 1, number: 1 });
//=> ['minimum', 'maximum']
```

```js
validate('Pa$$word', { special: 2 });
//=> ['minimum', 'maximum', 'special']
```

```js
validate('HelloWorld', { require: ['hello'], disable: ['world'] });
//=> ['minimum', 'maximum', 'require', 'disable']
```

> [!NOTE]
> `minimum` and `maximum` are always checked, so they appear in the result even when you did not ask for them. `disable` in the result means a rejected word was found.

---

### `words`

Splits a string into an array of words. Pass `1` first to remove punctuation as well.

**Example**

```js
words('the quick  brown fox');
//=> ['the', 'quick', 'brown', 'fox']
```

```js
words('Hello, world!');
//=> ['Hello,', 'world!']
```

```js
words(1, 'Hello, world!');
//=> ['Hello', 'world']
```

```js
pipe('Well... done!', words(1));
//=> ['Well', 'done']
```
