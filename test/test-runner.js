const spawn = require('child_process').spawn;
const path = require('path');
require = require('@std/esm')(module);

const fileName = 'world.js';
const filePath = path.join(__dirname, fileName);

const command = path.join('node_modules', '.bin', 'mocha');
const options = [
  '-b',
  '-s 75',
  '--ui bdd',
  '-r chai/register-expect ' + filePath
];
const mocha = spawn(command, options);
console.log(`Spawned "${command}" with options "${options.join(' ')}".`);

mocha.stdout.on('data', (data) => {
  console.log('STDOUT', data.toString());
});

mocha.stderr.on('data', (data) => {
  console.error(data.toString());
});

mocha.on('close', (exitcode) => {
  console.log('Closed with exit code', exitcode);
});

mocha.on('error', (error) => {
  console.error(error);
});
