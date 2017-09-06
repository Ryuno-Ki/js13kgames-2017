'use strict';
const chai = require('chai');
const expect = chai.expect;
const chaiInterface = require('chai-interface');
const spies = require('chai-spies');

chai.use(chaiInterface);
chai.use(spies);

const Store = require('./store').Store;

describe('Store', () => {
  const actionMock = { type: 'ACTION', payload: { foo: { bar: 'Yay' } } };
  const initialState = { foo: { bar: 'baz' } };
  const reducer = (state, action) => {
      const newState = Object.assign({}, initialState, action.payload);
      return newState;
  };

  it('has a getState method', () => {
    const store = Store.createStore(reducer);
    expect(store.getState).to.be.a('function');

    const state = store.getState();
    expect(state).to.deep.equal(initialState);
  });

  it('has a dispatch method', () => {
    const store = Store.createStore(reducer);
    expect(store.dispatch).to.be.a('function');
    
    const previousState = store.getState();
    store.dispatch(actionMock);
    const nextState = store.getState();
    const expected = Object.assign({}, previousState, actionMock.payload);
    expect(nextState).to.deep.equal(expected);
  });

  it('has a subscribe method', () => {
    const callback = () => {};
    const callbackSpy = chai.spy(callback);
    const store = Store.createStore(reducer);
    expect(store.subscribe).to.be.a('function');

    const unsubscribe = store.subscribe(callbackSpy);
    expect(unsubscribe).to.be.a('function');

    store.dispatch(actionMock);
    const newState = store.getState();
    expect(callbackSpy).to.have.been.called.with(newState);

    unsubscribe();
    store.dispatch(actionMock);
    expect(callbackSpy).to.not.have.been.called;
  });

  describe('createStore', () => {
    it('initialises the state tree', () => {
      const store = Store.createStore(reducer);
      const state = store.getState();
      expect(state).to.deep.equal(initialState);
    });

    it('hydrates the state when passed a second argument', () => {
      const savedState = { foo: { bar: 42 } };
      const store = Store.createStore(reducer, savedState);
      const state = store.getState();
      expect(state).to.deep.equal(savedState);
    });
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
});
