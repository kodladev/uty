/**
  Benchmark Size
  --------------------------------------------------------------------------------------------------
  Prints what each library adds to an application: the bytes left after a bundler has dropped
  the unused code and minified the rest, then gzip. Every package is measured the same way,
  importing only what the pipe in `rivals.js` needs.

    npm run bench:size
  --------------------------------------------------------------------------------------------------
*/

import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

const root = new URL('..', import.meta.url).pathname;

/** What is measured: a label and the import an application would write. */
const entries = [
  [
    'uty: pipe, filter, map, sum',
    `export { pipe } from './src/index.js'; export { filter, map } from './src/collect.js'; export { sum } from './src/math.js'`,
  ],
  [
    'uty: everything',
    ['index', 'collect', 'define', 'event', 'is', 'math', 'string', 'to', 'type']
      .map(name => `export * from './src/${name}.js'`)
      .join(';'),
  ],
  ['remeda: pipe, filter, map, sum', `export { pipe, filter, map, sum } from 'remeda'`],
  ['radash: select, sum', `export { select, sum } from 'radash'`],
  ['ramda: pipe, filter, map, sum', `export { pipe, filter, map, sum } from 'ramda'`],
  ['lodash: filter, map, sum', `export { filter, map, sum } from 'lodash'`],
];

console.log('package'.padEnd(34) + 'minified'.padStart(11) + 'gzip'.padStart(11));
for (const [label, contents] of entries) {
  const result = await build({
    stdin: { contents, resolveDir: root },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
  });
  const code = result.outputFiles[0].contents;
  const kb = bytes => (bytes / 1024).toFixed(1) + ' kB';
  console.log(
    label.padEnd(34) +
      kb(code.length).padStart(11) +
      kb(gzipSync(code, { level: 9 }).length).padStart(11)
  );
}
