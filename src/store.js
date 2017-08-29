//@flow
export interface IAction {
  key: string;
  payload: any;  // FIXME should be generic object
  type: string;
}

export class Store {
  /* properties */
  actions: any;  // FIXME should be generic object
  store: any;  // FIXME should be generic object

  dispatch(action: IAction) {
    // Destructuring assignment does not work in Node/mocha
    const payload = action.payload;
    const type = action.type;
    this.update(action);

    if (type in this.actions) {
      this.actions[type].forEach((callback) => {
        callback(payload);
      });
    }
  }

  get(key: string) {
    return this.store[key];
  }

  // FIXME substore should be object
  register(key: string, substore: any) {
    this.store[key] = substore;
  }

  subscribe(type: string, callback: () => mixed) {
    if (type in this.actions) {
      this.actions[type].push(callback);
    } else {
      this.actions[type] = [callback];
    }
  }

  update(action: IAction) {
    // Destructuring assignment does not work in Node/mocha
    const key = action.key;
    const payload = action.payload;
    const substore = this.store[key];
    this.store[key] = Object.assign(substore, payload);
  }

  constructor() {
    this.actions = {};
    this.store = {};
  }
}
