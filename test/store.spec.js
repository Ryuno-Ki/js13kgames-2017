'use strict';
const chai = require('chai');
const expect = chai.expect;
const chaiInterface = require('chai-interface');
const spies = require('chai-spies');

chai.use(chaiInterface);
chai.use(spies);

const Store = require('./store').Store;

describe('Store', () => {
  xit('can create a new store', () => {
    const newStore = Store.createStore(reducer);
  });

  xit('can hydrate a new store while creating', () => {
    const newStore = Store.createStore(reducer, storedState);
  });

  describe('reduceReducers', () => {
    const reducer1 = () => { return null; };
    const reducer2 = () => { return null; };
    const reducers = { reducer1, reducer2 };
    let globalReducer;

    beforeEach(() => {
      globalReducer = Store.reduceReducers(reducers);
    });

    it('accepts an object of reducers as only argument', () => {
      expect(() => { return Store.reduceReducers(reducers); }).to.not.throw();
    });

    it('returns a new reducer', () => {
      expect(globalReducer).to.be.a('function');
      expect(globalReducer.length).to.equal(2);
    });

    it('passes only subset of state argument to reducer', () => {
      const reducer1Spy = chai.spy.on(reducers, 'reducer1');
      const reducer2Spy = chai.spy.on(reducers, 'reducer2');
      const stateMock = { reducer1: 'foo', reducer2: 'bar', reducer3: 'baz' };
      const actionMock = { type: 'ACTION', payload: {} };

      globalReducer(stateMock, actionMock);
      expect(reducer1Spy).to.have.been.called.with('foo', actionMock);
      expect(reducer2Spy).to.have.been.called.with('bar', actionMock);
    });

    it('builds up a state out of the passed reducers', () => {
      const stateMock = { reducer1: 'foo', reducer2: 'bar' };
      const actionMock = { type: 'ACTION', payload: {} };
      const newState = globalReducer(stateMock, actionMock);
      const argumentKeys = Object.keys(reducers);
      expect(newState).to.be.an('object');

      argumentKeys.forEach((reducer) => {
        expect(newState).to.have.a.property(reducer);
      });
      expect(Object.keys(newState).length).to.equal(argumentKeys.length);
    });
  });

  xit('can dispatch reducers', () => {
    store.dispatch(action({foo: 'bar'}));
  });

  xit('offers a way to subscribe for changes', () => {
    const unsubscribe = store.subscribe(callback);
  });

  xit('gets the state', () => {
    const state = store.getState();
  });

  /*
   * Data flow:
   * 1. store.dispatch(action)
   * 2. store calls reducers
   * 3. root reducer combines substores into single store tree
   * 4. store saves store tree returned by root reducer
   */

  let store;

  beforeEach(() => {
    store = new Store();
  });

  it('has an actions property', () => {
    expect(store.actions).to.not.be.undefined;
  });

  it('has a store property', () => {
    expect(store.store).to.not.be.undefined;
  });

  describe('actions', () => {
    let actionType;
    let key;
    let substore;
    let action;
    let callback;

    beforeEach(() => {
      actionType = 'riddle';
      key = 'answer';
      substore = {};

      action = {
        key: key,
        payload: substore,
        type: actionType
      };
      callback = () => { return null; };
    });

    it('subscribes to an action type', () => {
      const registeredActions = store.actions[actionType];
      expect(registeredActions).to.be.undefined;
      store.subscribe(actionType, callback);
      expect(store.actions[actionType]).to.deep.equal([callback]);
    });

    it('subsribes more than once to an action type', () => {
      const registeredActions = store.actions[actionType];
      const expected = [callback, callback];

      expect(registeredActions).to.be.undefined;
      store.subscribe(actionType, callback);
      store.subscribe(actionType, callback);
      expect(store.actions[actionType]).to.deep.equal(expected);
    });

    it('invokes all callbacks', () => {
      const key = 'answer';
      const payload = {'is': 42};
      const substore = {};

      const action = {
        key: key,
        payload: payload,
        type: 'riddle'
      };
      const callbackSpy = chai.spy(callback);
      const registeredActions = store.actions[actionType];
      expect(registeredActions).to.be.undefined;

      store.register(key, substore);
      store.subscribe(actionType, callback);
      store.dispatch(action);
      expect(callbackSpy).to.have.been.called;
      // expect(callbackSpy).to.have.been.called.with(payload);
    });
  });

  describe('substore', () => {
    const key = 'answer';
    const substore = {};

    xit('throws an error when updating a non-registered substore', () => {
      const action = {
        key: key,
        payload: substore,
        type: 'riddle'
      };
  
      const registeredSubstore = store.store[key];
      expect(registeredSubstore).to.be.undefined;
      store.update(action);
      expect(registeredSubstore).to.throw;
    });

    describe('after registration of a substore', () => {
      beforeEach(() => {
        store.register(key, substore);
      });

      it('returns the substore', () => {
        expect(store.store[key]).to.equal(substore);
      });

      it('allows to register a substore', () => {
        const payload = {'is': 42};

        const action = {
          key: key,
          payload: payload,
          type: 'riddle'
        };
  
        const registeredSubstore = store.store[key];
        expect(registeredSubstore).to.equal(substore);

        store.update(action);
        expect(registeredSubstore).to.deep.equal(payload);
      });
    });
  });
});
