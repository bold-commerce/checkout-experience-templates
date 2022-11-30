/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* global console */
const version = require('./package.json').version;
console.info(`export const LIB_VERSION = '${version}';`);
