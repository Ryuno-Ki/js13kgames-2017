import { env } from 'process';
import { join } from 'path';

import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';  // needed to make rollup understand ES6

const filesizeOptions = { format: { exponent: 0 } };
const uglifyOptions = {};

export default {
  input: join(__dirname, 'src', 'index.js'),
  output: {
    file: join(__dirname, 'dist', 'index.js'),
    format: 'iife'
  },
  plugins: [
    uglify(uglifyOptions, minify),
    filesize(filesizeOptions),
  ],
  sourcemap: env.NODE_ENV === 'production' ? false : 'inline',
};
