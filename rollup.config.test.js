import { join } from 'path';

import flow from 'rollup-plugin-flow';

const flowOptions = { all: true, pretty: true };

const plugins = [
  flow(flowOptions),
];

export default [
  'game.js',
  'helper.js',
  'hero.js',
  'index.js',
  'store.js',
  'swipe.js',
  'wall.js',
  'world.js'
].map((fileName) => {
  return {
    input: join(__dirname, 'src', fileName),
    output: {
      file: join(__dirname, 'test', fileName),
      format: 'cjs',
      name: 'App'
    },
    plugins: plugins
  };
});
