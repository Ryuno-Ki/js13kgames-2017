'use strict';
const chai = require('chai');
const chaiInterface = require('chai-interface');
const expect = chai.expect;

chai.use(chaiInterface);

const Hero = require('./hero');
const HeroActions = Hero.Actions;
const HeroInitialState = Hero.initialState;
const HeroReducer = Hero.reduce;
const HeroTypes = Hero.Types;

describe('Hero', () => {
  it('has an initial state', () => {
    const initialState = HeroReducer();
    expect(initialState).to.equal(HeroInitialState);
    expect(initialState).to.have.interface({
      angle: Number,
      radius: Number,
    });
  });

  it('returns the given state', () => {
    const currentState = {};
    const action = {};
    const updatedState = HeroReducer(currentState, action);
    expect(updatedState).to.equal(currentState);
  });

  describe('Types', () => {
    it('moves down', () => {
      const type = HeroTypes.moveDown;
      expect(type).to.equal('HERO_MOVES_DOWN');
    });

    it('moves left', () => {
      const type = HeroTypes.moveLeft;
      expect(type).to.equal('HERO_MOVES_LEFT');
    });

    it('moves right', () => {
      const type = HeroTypes.moveRight;
      expect(type).to.equal('HERO_MOVES_RIGHT');
    });

    it('moves up', () => {
      const type = HeroTypes.moveUp;
      expect(type).to.equal('HERO_MOVES_UP');
    });
  });

  describe('Actions', () => {
    const distance = 42;

    it('moves down', () => {
      const type = HeroTypes.moveDown;
      const payload = { radius: -distance };

      const expected = { payload, type };
      const actual = HeroActions.moveDown(distance);
      expect(actual).to.deep.equal(expected);
    });

    it('moves left', () => {
      const type = HeroTypes.moveLeft;
      const payload = { angle: -distance };

      const expected = { payload, type };
      const actual = HeroActions.moveLeft(distance);
      expect(actual).to.deep.equal(expected);
    });

    it('moves right', () => {
      const type = HeroTypes.moveRight;
      const payload = { angle: distance };

      const expected = { payload, type };
      const actual = HeroActions.moveRight(distance);
      expect(actual).to.deep.equal(expected);
    });

    it('moves up', () => {
      const type = HeroTypes.moveUp;
      const payload = { radius: distance };

      const expected = { payload, type };
      const actual = HeroActions.moveUp(distance);
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('reducer', () => {
    const distance = 42;
    const initialState = HeroInitialState;

    it('moves down', () => {
      const action = HeroActions.moveDown(distance);
      const updatedState = HeroReducer(initialState, action);

      expect(updatedState.angle).to.equal(initialState.angle);
      expect(updatedState.radius).to.equal(initialState.radius - distance);
    });

    it('moves left', () => {
      const action = HeroActions.moveLeft(distance);
      const updatedState = HeroReducer(initialState, action);

      expect(updatedState.angle).to.equal(initialState.angle - distance);
      expect(updatedState.radius).to.equal(initialState.radius);
    });

    it('moves right', () => {
      const action = HeroActions.moveRight(distance);
      const updatedState = HeroReducer(initialState, action);

      expect(updatedState.angle).to.equal(initialState.angle + distance);
      expect(updatedState.radius).to.equal(initialState.radius);
    });

    it('moves up', () => {
      const action = HeroActions.moveUp(distance);
      const updatedState = HeroReducer(initialState, action);

      expect(updatedState.angle).to.equal(initialState.angle);
      expect(updatedState.radius).to.equal(initialState.radius + distance);
    });

  });
});
