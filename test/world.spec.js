'use strict';
const expect = require('chai').expect;
const World = require('./world').World;

describe('World', () => {

  before(() => {
    require('jsdom-global')();
  });

  it('has a positive height', () => {
    expect(World.HEIGHT).to.be.above(0);
  });
});
