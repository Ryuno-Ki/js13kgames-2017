import { join } from 'path';

import eslint from 'rollup-plugin-eslint';
import filesize from 'rollup-plugin-filesize';
import flow from 'rollup-plugin-flow';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';  // needed to make rollup understand ES6

const eslintOptions = { throwOnError: true };
const filesizeOptions = { format: { exponent: 0 } };
const flowOptions = { all: true, pretty: true };
const uglifyOptions = {};

const plugins = [
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
  plugins: plugins,
  sourcemap: false,
};
