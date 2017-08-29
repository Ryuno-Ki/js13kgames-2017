import { join } from 'path';

import flow from 'rollup-plugin-flow';

const flowOptions = { all: true, pretty: true };

const testPlugins = [
  flow(flowOptions),
];

export default {
  input: join(__dirname, 'test', 'test-runner.js'),
  output: {
    file: join(__dirname, 'test', 'index.js'),
    format: 'iife'
  },
  plugins: testPlugins
};
