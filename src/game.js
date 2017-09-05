//@flow
import { Helper } from './helper';
// import { Hero } from './hero';
import type { IHeroState } from './hero';
import { Store } from './store';
import { Swipe } from './swipe';
// import { Wall } from './wall';
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

// Polyfill for mocha
const noop = () => { return null; };
window.requestAnimationFrame = window.requestAnimationFrame || noop;

export class Game {
  /* Properties */
//   hero: Hero;
  lastUpdateTimestamp: number;
  startTime: Date;
  state: State;
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

  /*
  addWall(wall: Wall) {
    this.walls.push(wall);
  }
  */

  draw() {
    const hero = this.hero;
    const walls = this.walls;
    if (Game.detectCollision(hero, walls)) { Game.notifyUser(); }

    this.world.render(hero, walls);
  }

  /*
  init() {
    const self = this;
    const update = this.update;

    [1, 2, 3, 4, 5, 6].forEach((level) => {
      const wall = new Wall(level * World.WALLDISTANCE);
      this.addWall(wall);
    });

    this.registerArrowKeyHandlers();
    this.registerSwipeHandlers();
    window.requestAnimationFrame(update.bind(self));
  }
  */

  onKeyDown(event: KeyboardEvent) {
    const hero = this.hero;
    const key = event.keyCode;
    const keymap = Game.KEYMAP;
    const self = this;
    const update = this.update;

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
    window.requestAnimationFrame(update.bind(self));
  }

  registerArrowKeyHandlers() {
    const self = this;
    const onKeyDown = this.onKeyDown;
    window.document.body.addEventListener('keydown', onKeyDown.bind(self), false);
  }

  registerSwipeHandlers() {
    const hero = this.hero;
    const self = this;
    const update = this.update;

    const handlers = {
      onDown: () => {
        hero.moveDown();
        window.requestAnimationFrame(update.bind(self));
      },
      onLeft: () => {
        hero.moveLeft();
        window.requestAnimationFrame(update.bind(self));
      },
      onRight: () => {
        hero.moveRight();
        window.requestAnimationFrame(update.bind(self));
      },
      onUp: () => {
        hero.moveUp();
        window.requestAnimationFrame(update.bind(self));
      }
    };

    const swiper = new Swipe(this.world.element, handlers);
    swiper.run();
  }

  update(timestamp: number) {
    const fps = 60;
    const progress = timestamp - this.lastUpdateTimestamp;
    const isInitialDraw = progress < 0;
    const self = this;
    const update = this.update;

    if (progress > fps || isInitialDraw) {
      this.draw();
      this.updateTimer();
      window.requestAnimationFrame(update.bind(self));
      this.lastUpdateTimestamp = timestamp;
    }
  }

  updateTimer() {
    const start = this.startTime;
    const now = new Date();
    const elapsed = Math.round((now - start) / 1000);
    World.updateTimer(elapsed);
  }

  constructor(canvasId: string) {
    const store = new Store();
    // this.hero = new Hero(store);
    this.world = new World(canvasId);

    this.startTime = new Date();
    this.lastUpdateTimestamp = Number(new Date());
    this.state = {
      "user": {
        "angle": 0,
        "name": "Jane Doe",
        "radius": 0,
        "timeElapsed": (new Date()).toISOString()
      },
      "walls": [{
        "gate": {
          "start": 0,
          "end": 1
        },
        "radius": 0
      }],
      "world": {
        "height": World.HEIGHT,
        "width": World.WIDTH
      }
    };
    this.walls = [];
  }
}
