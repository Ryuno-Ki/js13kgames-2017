//@flow
import { Helper } from './helper';
import { Hero } from './hero';
import { Swipe } from './swipe';
import { Wall } from './wall';
import { World } from './world';

interface Keymap {
  DOWN: number;
  LEFT: number;
  RIGHT: number;
  UP: number;
}

export class Game {
  /* Properties */
  context: any; /* FIXME: type should be CanvasRenderingContext2d */
  element: HTMLCanvasElement;
  hero: Hero;
  lastUpdateTimestamp: number;
  paddingBetweenWalls: number;
  walls: Wall[];

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
    const text = `Code Red at ${now}!`;
    const element = window.document.createTextNode(text);
    window.document.body.appendChild(element);
  }

  addWall(wall: Wall) {
    this.walls.push(wall);
  }

  compareAngle(): boolean {
    const hero = this.hero;
    const position = Helper.mapCartesianToPolar(
      Helper.coordinationSystemToCenter(hero.x, hero.y)
    );
    const positionOfHero = position.r + hero.radius;
    const paddingBetweenWalls = this.paddingBetweenWalls;

    const collision = this.walls.filter((wall) => {
      // Only need to look at adjacent walls
      if (positionOfHero - wall.radius > paddingBetweenWalls) {
        return false;
      }
      if (wall.radius - positionOfHero > paddingBetweenWalls) {
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

  compareRadii(): boolean {
    const hero = this.hero;
    const position = Helper.mapCartesianToPolar(
      Helper.coordinationSystemToCenter(hero.x, hero.y)
    );
    const positionOfHero = position.r + hero.radius;
    const paddingBetweenWalls = this.paddingBetweenWalls;

    const collision = this.walls.map((wall) => {
      // Only need to compare radius
      return wall.radius;
    }).filter((wallRadius) => {
      // Only need to look at adjacent walls
      if (positionOfHero - wallRadius > paddingBetweenWalls) {
        return false;
      }
      if (wallRadius - positionOfHero > paddingBetweenWalls) {
        return false;
      }
      return true;
    }).map((wallRadius) => {
      // Does hero circle intersect with wall?
      if (position.r - hero.radius > wallRadius) {
        return false;
      }
      if (position.r + hero.radius < wallRadius) {
        return false;
      }
      return true;
    }).reduce((summary, intersection) => {
      // Is any value true?
      return summary || intersection;
    });
    return collision;
  }

  detectCollision(): boolean {
    return this.compareAngle() && this.compareRadii();
  }

  draw() {
    if (this.detectCollision()) { Game.notifyUser(); }

    const context = this.context;
    const leftEdge = 0;
    const topEdge = 0;
    context.clearRect(leftEdge, topEdge, World.WIDTH, World.HEIGHT);
    this.drawWalls();
    this.hero.render(context);
  }

  drawWalls() {
    const x = World.WIDTH / 2;
    const y = World.HEIGHT / 2;

    this.walls.forEach((wall) => {
      wall.render(this.context, { x, y });
    });
  }

  init() {
    [1, 2, 3, 4, 5, 6].forEach((level) => {
      const wall = new Wall(level * this.paddingBetweenWalls);
      this.addWall(wall);
    });

    this.registerArrowKeyHandlers();
    this.registerSwipeHandlers();
    window.requestAnimationFrame(this.update.bind(this));
  }

  onKeyDown(event: KeyboardEvent) {
    const key = event.keyCode;
    const keymap = Game.KEYMAP;

    switch(key) {
      case keymap.LEFT:
        this.hero.moveLeft();
        event.preventDefault();
        break;
      case keymap.UP:
        this.hero.moveUp();
        event.preventDefault();
        break;
      case keymap.RIGHT:
        this.hero.moveRight();
        event.preventDefault();
        break;
      case keymap.DOWN:
        this.hero.moveDown();
        event.preventDefault();
        break;
      default:
        // FIXME: Handle it. Neither console.log nor removing default branch
        console.log('Received keyCode', event.keyCode);
    }
    window.requestAnimationFrame(this.update.bind(this));
  }

  registerArrowKeyHandlers() {
    window.document.body.addEventListener('keydown', this.onKeyDown, false);
  }

  registerSwipeHandlers() {
    const handlers = {
      onDown: () => {
        this.hero.moveDown();
        window.requestAnimationFrame(this.update.bind(this));
      },
      onLeft: () => {
        this.hero.moveLeft();
        window.requestAnimationFrame(this.update.bind(this));
      },
      onRight: () => {
        this.hero.moveRight();
        window.requestAnimationFrame(this.update.bind(this));
      },
      onUp: () => {
        this.hero.moveUp();
        window.requestAnimationFrame(this.update.bind(this));
      }
    };

    const swiper = new Swipe(this.element, handlers);
    swiper.run();
  }

  setHero(hero: Hero) {
    this.hero = hero;
  }

  update(timestamp: number) {
    const fps = 60;
    const progress = timestamp - this.lastUpdateTimestamp;
    const isInitialDraw = progress < 0;

    if (progress > fps || isInitialDraw) {
      this.draw();
      window.requestAnimationFrame(this.update.bind(this));
      this.lastUpdateTimestamp = timestamp;
    }
  }

  constructor(canvasId: string) {
    const canvas = World.create(canvasId);
    this.context = canvas.getContext('2d');
    this.element = canvas;

    const fullCircleInRadians = 2 * Math.PI;
    this.paddingBetweenWalls = 0.9 * 3 * fullCircleInRadians;

    this.hero = new Hero(
      this.paddingBetweenWalls / 2,
      World.WIDTH / 2,
      World.HEIGHT / 2
    );

    this.lastUpdateTimestamp = Number(new Date());
    this.walls = [];
  }
}
