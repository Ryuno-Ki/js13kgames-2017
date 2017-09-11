//@flow
// import { Helper } from './helper';
// import { Hero } from './hero';
import { reduce as HeroReducer } from './hero';
import { Actions as HeroActions } from './hero';
import type { IHeroState } from './hero';
import { Store } from './store';
import { Swipe } from './swipe';
// import { Wall } from './wall';
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
//  walls: Wall[];
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
    const now = (new Date()).toISOString();
    // eslint-disable-next-line no-console
    console.log('Hit wall', now);
    window.document.body.classList.add('flash');
    setTimeout(() => { window.document.body.classList.remove('flash'); }, 500);
  }

  /*
  static compareAngle(hero: Hero, walls: Wall[]): boolean {
    const position = Helper.mapCartesianToPolar(
      Helper.coordinationSystemToCenter(hero.x, hero.y)
    );
    const positionOfHero = position.r + World.USERSIZE;
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
      const startGate = Helper.normaliseAngle(wall.startGate);
      const endGate = Helper.normaliseAngle(wall.endGate);
      const heroAngle = Helper.normaliseAngle(2*Math.PI - position.phi);

      if (startGate < heroAngle && endGate > heroAngle) {
        return false;
      }
      return true;
    }).reduce((summary, current) => {
      return summary || current;
    });
    return collision;
  }
  */

  /*
  static compareRadii(hero: Hero, walls: Wall[]): boolean {
    const position = Helper.mapCartesianToPolar(
      Helper.coordinationSystemToCenter(hero.x, hero.y)
    );
    const positionOfHero = position.r + World.USERSIZE;
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
      if (position.r - World.USERSIZE > wallRadius) {
        return false;
      }
      if (position.r + World.USERSIZE < wallRadius) {
        return false;
      }
      return true;
    }).reduce((summary, intersection) => {
      // Is any value true?
      return summary || intersection;
    });
    return collision;
  }
  */

  /*
  static detectCollision(hero: Hero, walls: Wall[]): boolean {
    const hitWallBecauseOfAngle = Game.compareAngle(hero, walls);
    const hitWallBecauseOfRadius = Game.compareRadii(hero, walls);
    return hitWallBecauseOfAngle && hitWallBecauseOfRadius;
  }
  */
  static detectCollision(): boolean {
    return false;
  }

  static update(world, store) {
    const state = store.getState();
    if (Game.detectCollision(state)) { Game.notifyUser(); }
    world.render(store.getState());
  }

  init() {
    const MAX_LEVEL = 6;
    for (let level = 2; level < MAX_LEVEL; level++) {
      let state = this.store.getState();
      let walls = state.walls.walls;
      let payload = {
        walls: walls,
        radius: level * 10,
        width: World.WALLDISTANCE
      };
      this.store.dispatch(WallActions.add(payload));
    }
    // this.registerArrowKeyHandlers();
    this.registerSwipeHandlers();
  }

  onKeyDown(event: KeyboardEvent) {
    const hero = this.hero;
    const key = event.keyCode;
    const keymap = Game.KEYMAP;

    switch(key) {
      case keymap.LEFT:
        hero.moveLeft();
        event.preventDefault();
        break;
      case keymap.UP:
        hero.moveUp();
        event.preventDefault();
        break;
      case keymap.RIGHT:
        hero.moveRight();
        event.preventDefault();
        break;
      case keymap.DOWN:
        hero.moveDown();
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
      onDown: (distance) => {  store.dispatch(HeroActions.moveDown(distance)); },
      onLeft: (distance) => {  store.dispatch(HeroActions.moveLeft(distance)); },
      onRight: (distance) => { store.dispatch(HeroActions.moveRight(distance)); },
      onUp: (distance) => { store.dispatch(HeroActions.moveUp(distance)); }
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
