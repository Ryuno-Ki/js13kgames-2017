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

  xit('can combine reducers', () => {
    const combinedReducers = Store.combineReducers({
      reducer1,
      reducer2
    });

    /*
     * nextState1 = reducer1(state[reducer1], action);
     * nextState2 = reducer2(state[reducer2], action);
     * return {
     *   reducer1: nextState1,
     *   reducer2: nextState2
     * };
     */
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
