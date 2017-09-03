import { join } from 'path';

import flow from 'rollup-plugin-flow';
import istanbul from 'rollup-plugin-istanbul';
// Workaround as per https://github.com/artberri/rollup-plugin-istanbul/issues/16
import NYC from 'nyc';

const nyc = new NYC();
const istanbulNext = new nyc._instrumenterLib.istanbul();

const flowOptions = { all: true, pretty: true };
const istanbulOptions = {
  exclude: ['test/*.js'],
  instrumenter: {
    Instrumenter: istanbulNext.createInstrumenter
  }
};

const plugins = [
  flow(flowOptions),
  istanbul(istanbulOptions)
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
