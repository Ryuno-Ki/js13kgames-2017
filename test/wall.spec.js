'use strict';
const chai = require('chai');
const expect = chai.expect;
const Wall = require('./wall').Wall;

describe('Wall', () => {
  const radius = 42;
  let wall;

  beforeEach(() => {
    wall = new Wall(radius);
  });

  it('has a radius property', () => {
    expect(wall.radius).to.not.be.undefined;
    expect(wall.radius).to.equal(radius);
  });

  it('has a startGate property', () => {
    expect(wall.startGate).to.not.be.undefined;
  });

  it('has an endGate property', () => {
    expect(wall.endGate).to.not.be.undefined;
  });
});
