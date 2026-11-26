# Benchmark

uty next to other libraries: what the same pipe handles, how fast it is, and how large it is in a bundle.

The pipe is the one from the main README: keep the numbers above one, double them, add them up. [`rivals.js`](./rivals.js) shows how it is written for each library.

## What the same pipe handles

|                        | uty | remeda | radash | lodash | ramda | plain JavaScript |
| ---------------------- | :-: | :----: | :----: | :----: | :---: | :--------------: |
| an array               |  ✓  |   ✓    |   ✓    |   ✓    |   ✓   |        ✓         |
| an object              |  ✓  |   –    |   –    |   ✓    |   –   |        –         |
| a Promise of an array  |  ✓  |   –    |   –    |   –    |   –   |        –         |
| a Promise of an object |  ✓  |   –    |   –    |   –    |   –   |        –         |

A dash is a thrown error, except for the two Promise rows of lodash and ramda, which answer `0` without one.

The others do have a way for objects and Promises; it is a different function, or a pipe written differently. This table is about giving the same pipe a different kind of data.

## Speed

On Node 24 and Apple silicon.

|                                      | 5 items | 10,000 items |
| ------------------------------------ | ------: | -----------: |
| **uty**                              |   90 ns |        96 µs |
| radash                               |   55 ns |       100 µs |
| remeda                               |   93 ns |       110 µs |
| lodash                               |   85 ns |       154 µs |
| plain JavaScript                     |   71 ns |       174 µs |
| ramda                                |  288 ns |       371 µs |
| plain JavaScript, callbacks in place |   18 ns |        31 µs |

Almost all of this time is spent calling the two callbacks, once per item. The engine can build a callback into the loop only where it always meets the same one, and that is the last row: `data.filter(n => n > 1).map(n => n * 2)` written out where it is used. A function that takes its callbacks from the caller, a library's or your own, meets a different one on every use and has to call it each time. The other rows are measured that way, after every library has been given several different callbacks, as it would be in an application.

So no library is as fast as the loop you write in place, and the libraries are close to each other. radash is ahead on five items because its `select` filters and maps in one pass. Read small differences as a tie.

## Size

What each library adds to an application for this pipe, minified and gzipped.

|                                 |    Size |
| ------------------------------- | ------: |
| radash, select and sum          |  0.1 kB |
| remeda, pipe, filter, map, sum  |  1.2 kB |
| **uty, pipe, filter, map, sum** |  1.8 kB |
| ramda, pipe, filter, map, sum   |  2.2 kB |
| **uty, everything**             |  7.1 kB |
| lodash, filter, map, sum        | 26.2 kB |

The `lodash` package cannot be trimmed by a bundler, so any import brings all of it.

## Run it

```shell
npm run bench:handles   # the first table; add -- --show to see each answer
npm run bench:table     # the speed table
npm run bench:size      # the size table
npm run bench           # every uty function next to the plain JavaScript doing the same job
npm run bench:compare   # the current source against an earlier one
```

`npm run bench` measures one function after another with a single callback each, which is the case the engine handles best; it shows the cost of a call, not what an application will see. `bench:table` and `bench:compare` warm everything up with several callbacks first and let the sides take turns; use them when a few percent matter.
