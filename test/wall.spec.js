'use strict';
const chai = require('chai');
const chaiInterface = require('chai-interface');
const expect = chai.expect;

chai.use(chaiInterface);

const Wall = require('./wall');
const WallActions = Wall.Actions;
const WallInitialState = Wall.initialState;
const WallReducer = Wall.reduce;
const WallTypes = Wall.Types;

describe('Wall', () => {
  it('has an initial state', () => {
    const initialState = WallReducer();
    expect(initialState).to.equal(WallInitialState);
    expect(initialState).to.have.interface({
      gate: {
        end: Number,
        start: Number,
      },
      radius: Number,
    });
  });

  it('returns the given state', () => {
    const currentState = {};
    const action = {};
    const updatedState = WallReducer(currentState, action);
    expect(updatedState).to.equal(currentState);
  });

  describe('Types', () => {
    it('sets radius', () => {
      const key = WallTypes.setRadius;
      expect(key).to.equal('WALL_SET_RADIUS');
    });

    it('randomises the gate', () => {
      const key = WallTypes.randomiseGate;
      expect(key).to.equal('WALL_RANDOMISE_GATE');
    });
  });

  describe('Actions', () => {
    const distance = 2;

    it('sets radius', () => {
      const type = WallTypes.setRadius;
      const payload = { radius: distance };

      const expected = { payload, type };
      const actual = WallActions.setRadius(distance);
      expect(actual).to.deep.equal(expected);
    });

    it('randomises the gate', () => {
      const type = WallTypes.randomiseGate;
      const payload = { width: distance };
      const tolerance = 0.1 * distance;

      const newState = WallActions.randomiseGate(distance);
      expect(newState.type).to.equal(type);
      expect(newState.payload).to.have.own.property('gate');
      expect(newState.payload.gate).to.have.own.property('start');
      expect(newState.payload.gate).to.have.own.property('end');

      expect(newState.payload.gate.start).to.be.at.least(0);
      expect(newState.payload.gate.end).to.be.at.least(0);
      expect(newState.payload.gate.start).to.be.at.most(2 * Math.PI);
      expect(newState.payload.gate.end).to.be.at.most(2 * Math.PI);

      if (newState.payload.gate.end > newState.payload.gate.start) {
        const width = newState.payload.gate.end - newState.payload.gate.start;
        expect(width).to.be.approximately(distance, tolerance);
      } else {
        const width = newState.payload.gate.start - newState.payload.gate.end;
        expect(width).to.be.approximately(distance, tolerance);
      }
    });
  });

  describe('reducer', () => {
    const distance = 2;
    const initialState = WallInitialState;

    it('sets radius', () => {
      const action = WallActions.setRadius(distance);
      const updatedState = WallReducer(initialState, action);

      expect(updatedState.radius).to.equal(distance);
      expect(updatedState.gate).to.deep.equal(initialState.gate);
    });

    it('randomises the gate', () => {
      const action = WallActions.randomiseGate(distance);
      const updatedState = WallReducer(initialState, action);

      expect(updatedState.radius).to.equal(initialState.radius);
      expect(updatedState.gate).to.not.deep.equal(initialState.gate);
    });
  });
});
