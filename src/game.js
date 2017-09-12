//@flow
import { Helper } from './helper';
// import { Hero } from './hero';
import { reduce as HeroReducer } from './hero';
import { Actions as HeroActions } from './hero';
import type { IHeroState } from './hero';
import { Store } from './store';
import { Swipe } from './swipe';
import { reduce as WallReducer } from './wall';
import { Actions as WallActions } from './wall';
import type { IWallState } from './wall';
import { World } from './world';
import type { IWorldState } from './world';

interface Keymap {
  DOWN: number;
  LEFT: number;
  RIGHT: number;
  UP: number;
}

interface State {
  user: IHeroState;
  walls: IWallState[];
  world: IWorldState;
}

export class Game {
  /* Properties */
//   hero: Hero;
  store: any;  // FIXME: Should be IStore
  world: World;

  static get KEYMAP(): Keymap {
    return {
      'LEFT': 37,
      'UP': 38,
      'RIGHT': 39,
      'DOWN': 40,
    };
  }

  static notifyUser() {
    window.document.body.classList.add('flash');
    setTimeout(() => { window.document.body.classList.remove('flash'); }, 500);
  }

  static compareAngle(hero: Hero, walls: Wall[]): boolean {
    const positionOfHero = hero.radius + World.USERSIZE;
    const wallDistanceWalls = World.WALLDISTANCE;

    const collision = walls.filter((wall) => {
      // Only need to look at adjacent walls
      if (positionOfHero - wall.radius > wallDistanceWalls) {
        return false;
      }
      if (wall.radius - positionOfHero > wallDistanceWalls) {
        return false;
      }
      return true;
    }).map((wall) => {
      // atan2 (hero) is measuring from x-axis counterclockwise
      // canvas is drawing from x-axis clockwise
      // hence, translate hero and normalise angles
      const startGate = Helper.normaliseAngle(wall.gate.start);
      const endGate = Helper.normaliseAngle(wall.gate.end);
      const heroAngle = Helper.normaliseAngle(hero.angle);

      if (startGate < heroAngle && endGate > heroAngle) {
        return false;
      }
      return true;
    }).reduce((summary, current) => {
      return summary || current;
    });
    return collision;
  }

  static compareRadii(hero: Hero, walls: Wall[]): boolean {
    const positionOfHero = hero.radius + World.USERSIZE;
    const wallDistanceWalls = World.WALLDISTANCE;

    const collision = walls.map((wall) => {
      // Only need to compare radius
      return wall.radius;
    }).filter((wallRadius) => {
      // Only need to look at adjacent walls
      if (positionOfHero - wallRadius > wallDistanceWalls) {
        return false;
      }
      if (wallRadius - positionOfHero > wallDistanceWalls) {
        return false;
      }
      return true;
    }).map((wallRadius) => {
      // Does hero circle intersect with wall?
      if (positionOfHero + World.USERSIZE < wallRadius) {
        // inside
        return false;
      }
      if (positionOfHero - World.USERSIZE > wallRadius) {
        // outside
        return false;
      }
      return true;
    }).reduce((summary, intersection) => {
      // Is any value true?
      return summary || intersection;
    });
    return collision;
  }

  static detectCollision(state): boolean {
    const hero = state.user;
    const walls = state.walls.walls;
    const hitWallBecauseOfAngle = Game.compareAngle(hero, walls);
    const hitWallBecauseOfRadius = Game.compareRadii(hero, walls);
    return hitWallBecauseOfAngle && hitWallBecauseOfRadius;
  }

  static update(world, store) {
    const state = store.getState();
    if (Game.detectCollision(state)) { Game.notifyUser(); }
    world.render(store.getState());
  }

  static _buildHeroPayload(state, distance) {
    const payload = Object.assign({}, state.user, {distance: distance});
    return payload;
  }

  init() {
    this.store.dispatch({}, {type: 'INIT', payload: {}});

    const MAX_LEVEL = 6;
    let state;
    let walls;
    let payload;

    for (let level = 2; level < MAX_LEVEL; level++) {
      state = this.store.getState();
      walls = state.walls.walls;
      payload = {
        walls: walls,
        radius: level * World.WALLDISTANCE,
        width: World.GATESIZE
      };
      this.store.dispatch(WallActions.add(payload));
    }
    this.registerArrowKeyHandlers();
    this.registerSwipeHandlers();

    // In order to not confuse the user when hitting left or right
    state = this.store.getState();
    payload = Game._buildHeroPayload(state, 5);
    this.store.dispatch(HeroActions.moveUp(payload));
  }

  onKeyDown(event: KeyboardEvent) {
    const key = event.keyCode;
    const keymap = Game.KEYMAP;
    const store = this.store;
    const state = store.getState();
    const distance = 5;
    const payload = Game._buildHeroPayload(state, distance);

    switch(key) {
      case keymap.LEFT:
        store.dispatch(HeroActions.moveLeft(payload));
        event.preventDefault();
        break;
      case keymap.UP:
        store.dispatch(HeroActions.moveUp(payload));
        event.preventDefault();
        break;
      case keymap.RIGHT:
        store.dispatch(HeroActions.moveRight(payload));
        event.preventDefault();
        break;
      case keymap.DOWN:
        store.dispatch(HeroActions.moveDown(payload));
        event.preventDefault();
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('Received keyCode', event.keyCode);
    }
  }

  registerArrowKeyHandlers() {
    const self = this;
    const onKeyDown = this.onKeyDown;
    window.document.body.addEventListener('keydown', onKeyDown.bind(self), false);
  }

  registerSwipeHandlers() {
    const store = this.store;

    const handlers = {
      onDown: (distance) => {
        const state = store.getState();
        const payload = Game._buildHeroPayload(state, distance);
        store.dispatch(HeroActions.moveDown(payload));
      },
      onLeft: (distance) => {
        const state = store.getState();
        const payload = Game._buildHeroPayload(state, distance);
        store.dispatch(HeroActions.moveLeft(payload));
      },
      onRight: (distance) => {
        const state = store.getState();
        const payload = Game._buildHeroPayload(state, distance);
        store.dispatch(HeroActions.moveRight(payload));
      },
      onUp: (distance) => {
        const state = store.getState();
        const payload = Game._buildHeroPayload(state, distance);
        store.dispatch(HeroActions.moveUp(payload));
      }
    };

    const swiper = new Swipe(this.world.element, handlers);
    swiper.run();
  }

  constructor(canvasId: string) {
    const reducers = { user: HeroReducer, walls: WallReducer };
    const globalReducer = Store.reduceReducers(reducers);
    this.store = Store.createStore(globalReducer);
    this.world = new World(canvasId);

    this.store.subscribe(() => {
      Game.update(this.world, this.store);
    });
  }
}
