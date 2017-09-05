'use strict';
const chai = require('chai');
const expect = chai.expect;
const spy = require('chai-spies');

chai.use(spy);

const Game = require('./index').Game;

describe('Index', () => {
  it('initialises a game', () => {
    const gameInitSpy = chai.spy.on(Game, 'init');
    require('./index');
    expect(gameInitSpy).to.have.been.called;
  });
});
