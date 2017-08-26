//@flow
import { Helper } from './helper';
import type { IAction, Store } from './store';
import { World } from './world';

export interface IHeroState {
  angle: number;
  name: string;
  radius: number;
  timeElapsed: string;
}

export class Hero {
  /* properties */
  globalStore: Store;

  static registerStore(globalStore: Store): Store {
    const now = new Date();
    const heroStore: IHeroState = {
      angle: 0,
      name: 'Jane Doe',
      radius: 0,
      timeElapsed: now.toISOString()
    };
    globalStore.register('user', heroStore);
    return globalStore;
  }

  // FIXME: Define interface for substore
  get store(): any {
    return this.globalStore.get('user');
  }

  set store(action: IAction) {
    this.globalStore.dispatch(action);
  }

  get x(): number {
    const { angle, radius } = this.store;
    const polar = { r: radius, phi: angle };
    const cartesian = Helper.mapPolarToCartesian(polar);
    const translated = Helper.coordinationSystemToVertex(cartesian.x, cartesian.y);
    return translated.p;
  }

  get y(): number {
    const { angle, radius } = this.store;
    const polar = { r: radius, phi: angle };
    const cartesian = Helper.mapPolarToCartesian(polar);
    const translated = Helper.coordinationSystemToVertex(cartesian.x, cartesian.y);
    return translated.q;
  }

  moveDown() {
    const { radius } = this.store;
    const action = {
      key: 'user',
      payload: { radius: radius - World.USERVELOCITY },
      type: 'UserMoveDown'
    };
    this.store = action;
  }

  moveLeft() {
    const { angle } = this.store;
    const action = {
      key: 'user',
      payload: { angle: angle - World.USERROTATION },
      type: 'UserMoveLeft'
    };
    this.store = action;
  }

  moveRight() {
    const { angle } = this.store;
    const action = {
      key: 'user',
      payload: { angle: angle + World.USERROTATION },
      type: 'UserMoveRight'
    };
    this.store = action;
  }

  moveUp() {
    const { radius } = this.store;
    const action = {
      key: 'user',
      payload: { radius: radius + World.USERVELOCITY },
      type: 'UserMoveUp'
    };
    this.store = action;
  }

  constructor(store: Store) {
    const globalStore = Hero.registerStore(store);
    this.globalStore = globalStore;
  }
}
