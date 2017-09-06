import { join } from 'path';

import eslint from 'rollup-plugin-eslint';
import flow from 'rollup-plugin-flow';
import visualizer from 'rollup-plugin-visualizer';

const eslintOptions = { throwOnError: true };
const flowOptions = { all: true, pretty: true };
const visualizerOptions = {};

const plugins = [
  flow(flowOptions),
  eslint(eslintOptions),
  visualizer(visualizerOptions)
];

export default {
  input: join(__dirname, 'src', 'index.js'),
  output: {
    file: join(__dirname, 'dist', 'index.js'),
    format: 'iife',
    name: 'game'
  },
  plugins: plugins,
  sourcemap: 'inline',
};
