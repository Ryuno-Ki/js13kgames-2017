//@flow
import { Helper } from './helper';
import type { Hero } from './hero';
import type { Wall } from './wall';

export interface IWorldState {
  height: number;
  width: number;
}

export class World {
  /* properties */
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  static create(id: string): HTMLCanvasElement {
    const canvas = World.createCanvas(id);
    window.document.body.appendChild(canvas);
    return canvas;
  }

  static createCanvas(id: string): HTMLCanvasElement {
    const element = window.document.createElement('canvas');
    element.setAttribute('id', id);
    element.setAttribute('height', `${World.HEIGHT}px`);
    element.setAttribute('width', `${World.WIDTH}px`);
    return element;
  }

  static get GATESIZE(): number {
    return 1.05 * World.USERSIZE;
  }

  static get HEIGHT(): number {
    return Math.min(window.innerHeight, window.innerWidth);
  }

  static get USERSIZE(): number {
    return World.WALLDISTANCE / 3;
  }

  static get USERROTATION(): number {
    const input = window.document.getElementById('angle');
    if (input === null) {
      //eslint-disable-next-line no-console
      console.log('Fallback USERROTATION');
      return 0.02 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
    }
    const degree = parseInt(input.value, 10);
    return Helper.mapDegreeToRadians(degree);
  }

  static get USERVELOCITY(): number {
    return 3;
    // return 0.05 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get WALLDISTANCE(): number {
   return 0.06 * (World.HEIGHT + World.WIDTH) / 2;
  }

  static get WIDTH(): number {
    return Math.min(window.innerHeight, window.innerWidth);
  }

  render(state) {
    const context = this.context;
    const leftEdge = 0;
    const topEdge = 0;
    const walls = state.walls.walls;
    context.clearRect(leftEdge, topEdge, World.WIDTH, World.HEIGHT);
    walls.forEach((wall) => { this.renderWall(wall); });
    this.renderHero(state.user);
  }

  renderHero(hero: Hero) {
    const fullCircleInRadians = 2 * Math.PI;
    const startAngle = 0;
    const endAngle = 0.9 * fullCircleInRadians;
    const size = World.USERSIZE;
    const context = this.context;
    // Destructuring assignment does not work in Node/mocha
    const cartesian = Helper.mapPolarToCartesian({r: hero.radius, phi: hero.angle});
    const center = Helper.coordinationSystemToVertex(cartesian.x, cartesian.y);
    const x = center.p;
    const y = center.q;

    context.beginPath();
    context.arc(x, y, size, startAngle, endAngle);
    context.fill();
  }

  renderWall(wall: Wall) {
    const x = World.WIDTH / 2;
    const y = World.HEIGHT / 2;
    const context = this.context;
    // Destructuring assignment does not work in Node/mocha
    const endGate = wall.gate.end;
    const startGate = wall.gate.start;
    const radius = wall.radius;

    // Since the gate shall be spared out from circle, switch its start
    // and end when drawing the arc
    context.beginPath();
    context.arc(x, y, radius, endGate, startGate);
    context.stroke();
  }

  constructor(id: string) {
    this.element = World.create(id);
    this.context = this.element.getContext('2d');
  }
}
