import { join } from 'path';

import flow from 'rollup-plugin-flow';

const flowOptions = { all: true, pretty: true };

const plugins = [
  flow(flowOptions),
];

export default {
  input: join(__dirname, 'src', 'index.js'),
  output: {
    file: join(__dirname, 'test', 'index.js'),
    format: 'cjs'
  },
  plugins: plugins
};
