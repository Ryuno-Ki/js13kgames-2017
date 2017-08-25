import { Helper } from './helper';
import { Hero } from './hero';
import { Swipe } from './swipe';
import { Wall } from './wall';
import { World } from './world';

export class Game {
  addWall(wall) {
    this.walls.push(wall);
  }

  compareAngle() {
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
    return true;
  }

  compareRadii() {
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

  detectCollision() {
    return this.compareAngle() && this.compareRadii();
  }

  draw() {
    const context = this.context;
    if (this.detectCollision()) {
      console.warn('Code RED');
    }
    context.clearRect(0, 0, this.width, this.height);
    this.drawWalls();
    this.hero.render(context);
  }

  drawWalls() {
    const x = this.width / 2;
    const y = this.height / 2;

    this.walls.forEach((wall) => {
      wall.render(this.context, x, y);
    });
  }

  init() {
    const hero = new Hero(
      this.paddingBetweenWalls / 2,
      this.width / 2,
      this.height / 2
    );
    this.setHero(hero);

    [1, 2, 3, 4, 5, 6].forEach((level) => {
      const wall = new Wall(level * this.paddingBetweenWalls);
      this.addWall(wall);
    });

    this.registerArrowKeyHandlers();
    this.registerSwipeHandlers();
    window.requestAnimationFrame(this.update.bind(this));
  }

  registerArrowKeyHandlers() {
    const keymap = {
      'LEFT': 37,
      'UP': 38,
      'RIGHT': 39,
      'DOWN': 40,
    };

    document.body.addEventListener('keydown', (event) => {
      const key = event.keyCode;
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
          console.log('Received keyCode', event.keyCode);
      }
      window.requestAnimationFrame(this.update.bind(this));
    }, false);
  }

  registerSwipeHandlers() {
    const swiper = new Swipe(this.element);
    swiper.onLeft(() => {
      this.hero.moveLeft();
      window.requestAnimationFrame(this.update.bind(this));
    });
    swiper.onUp(() => {
      this.hero.moveUp();
      window.requestAnimationFrame(this.update.bind(this));
    });
    swiper.onRight(() => {
      this.hero.moveRight();
      window.requestAnimationFrame(this.update.bind(this));
    });
    swiper.onDown(() => {
      this.hero.moveDown();
      window.requestAnimationFrame(this.update.bind(this));
    });
    swiper.run();
  }

  setHero(hero) {
    this.hero = hero;
  }

  update(timestamp) {
    const fps = 60;
    const progress = timestamp - this.lastUpdateTimestamp;
    const isInitialDraw = progress < 0;

    if (progress > fps || isInitialDraw) {
      this.draw();
      window.requestAnimationFrame(this.update.bind(this));
      this.lastUpdateTimestamp = timestamp;
    }
  }

  constructor(canvasId) {
    const canvas = document.getElementById('game');
    const height = World.HEIGHT;
    const width = World.WIDTH;
    canvas.setAttribute('height', height + 'px');
    canvas.setAttribute('width', width + 'px');

    this.context = canvas.getContext('2d');
    this.element = canvas;
    this.height = parseInt(height, 10);
    this.width = parseInt(width, 10);

    this.hero = null;
    this.lastUpdateTimestamp = Number(new Date());
    this.walls = [];

    const fullCircleInRadians = 2 * Math.PI;
    this.paddingBetweenWalls = 0.9 * 3 * fullCircleInRadians;
  }
}
