//@flow
export interface IAction {
  key: string;
  payload: any;  // FIXME should be generic object
  type: string;
}

export class Store {
  /* properties */
  _reducer: Function;  // TODO: Maybe there is a way to describe a IReducer?
  _state: any;  // FIXME: should be state object
  _subscribers: Function[];  // TODO: Maybe there is a way to describe IReducer?

  static createStore(reducer, savedState) {
    const dummyAction = { type: 'DUMMY', payload: {} };
    const initialState = reducer(savedState, dummyAction);
    const state = Object.assign({}, initialState, savedState);
    return new Store(reducer, state);
  }

  static reduceReducers(reducers): IReducer {
    return (store, action: IAction) => {
      const newStore = {};
      Object.keys(reducers).forEach(
        (subStoreToReducerMapping) => {
          const reducer = reducers[subStoreToReducerMapping];
          const subStore = store ? store[subStoreToReducerMapping] : null;
          const newSubStore = reducer(subStore, action);

          newStore[subStoreToReducerMapping] = newSubStore;
        }
      );
      return newStore;
    };
  }

  dispatch(action: IAction) {
    const previousState = this.getState();
    const nextState = this._reducer(previousState, action);
    this._state = nextState;

    this._subscribers.forEach((subscriber) => {
      subscriber(nextState);
    });
  }

  getState() {
    return this._state;
  }

  subscribe(callback) {
    this._subscribers.push(callback);
    const unsubscribe = () => {
      return this._subscribers; // TODO: Without callback, splice?
    };
    return unsubscribe;
  }

  constructor(reducer, initialState) {
    const state = initialState || {};
    this._state = Object.assign({}, state);
    this._reducer = reducer;
    this._subscribers = [];
  }
}
