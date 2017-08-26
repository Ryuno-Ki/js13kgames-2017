import { env } from 'process';
import { join } from 'path';

import eslint from 'rollup-plugin-eslint';
import filesize from 'rollup-plugin-filesize';
import flow from 'rollup-plugin-flow';
import uglify from 'rollup-plugin-uglify';
import visualizer from 'rollup-plugin-visualizer';
import { minify } from 'uglify-es';  // needed to make rollup understand ES6

const eslintOptions = { throwOnError: true };
const filesizeOptions = { format: { exponent: 0 } };
const flowOptions = { all: true, pretty: true };
const uglifyOptions = {};
const visualizerOptions = {};

const isProduction = env.NODE_ENV === 'production';

const devPlugins = [
  flow(flowOptions),
  eslint(eslintOptions),
  visualizer(visualizerOptions)
];

const prodPlugins = [
  flow(flowOptions),
  eslint(eslintOptions),
  uglify(uglifyOptions, minify),
  filesize(filesizeOptions)
];

export default {
  input: join(__dirname, 'src', 'index.js'),
  output: {
    file: join(__dirname, 'dist', 'index.js'),
    format: 'iife'
  },
  plugins: isProduction ? prodPlugins : devPlugins,
  sourcemap: isProduction ? false : 'inline',
};
