'use strict';
const fs = require('fs');
const path = require('path');
const process = require('process');

const flowRemoveTypes = require('flow-remove-types');

const fileNames = [
  'helper.js',
  'world.js',
];
fileNames.forEach((fileName) => {
  const filePath = path.join(__dirname, '..', 'src', fileName);
  const tempPath = path.join(__dirname, fileName);

  const content = fs.readFileSync(filePath, 'utf8');
  const processed = flowRemoveTypes(content);
  fs.writeFileSync(tempPath, processed);
});
