import { env } from 'process';

import * as configDev from './rollup.config.dev';
import * as configProd from './rollup.config.prod';
import * as configTest from './rollup.config.test';

let config;

switch (env.NODE_ENV) {
  case 'test':
    config = configTest;
    break;
  case 'production':
    config = configProd;
    break;
  default:
    config = configDev;
}

export default config.default;
