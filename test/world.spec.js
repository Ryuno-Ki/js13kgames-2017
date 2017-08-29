'use strict';
const expect = require('chai').expect;
const World = require('./index');

console.log('Testing world', World);
describe('World', () => {
  let doc;

  before(() => {
    require('jsdom-global')();
  });

  it('has a positive height', () => {
    expect(World.HEIGHT).to.be.above(0);
  });
});
