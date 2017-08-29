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
    const element = document.createElement('canvas');
    element.setAttribute('id', id);
    element.setAttribute('height', `${World.HEIGHT}px`);
    element.setAttribute('width', `${World.WIDTH}px`);
    window.document.body.appendChild(element);
    return element;
  }

  static get GATESIZE(): number {
    return 0.15;
  }

  static get HEIGHT(): number {
    return Math.min(window.innerHeight, window.innerWidth);
  }

  static get USERSIZE(): number {
    return World.WALLDISTANCE / 3;
  }

  static get USERROTATION(): number {
    return Helper.mapDegreeToRadians(5);
    // return 0.02 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
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

  static updateTimer(elapsedTime) {
    const elapsedContainer = window.document.getElementById('elapsed');
    elapsedContainer.innerText = elapsedTime;
  }

  render(hero: Hero, walls: Wall[]) {
    const context = this.context;
    const leftEdge = 0;
    const topEdge = 0;
    context.clearRect(leftEdge, topEdge, World.WIDTH, World.HEIGHT);
    walls.forEach((wall) => { this.renderWall(wall); });
    this.renderHero(hero);
  }

  renderHero(hero: Hero) {
    const fullCircleInRadians = 2 * Math.PI;
    const startAngle = 0;
    const endAngle = 0.9 * fullCircleInRadians;
    const size = World.USERSIZE;
    const context = this.context;
    // Destructuring assignment does not work in Node/mocha
    const x = hero.x;
    const y = hero.y;

    // FIXME: Read from hero instance
    const hit = false;
    context.fillStyle = hit ? 'red' : 'black';

    context.beginPath();
    context.arc(x, y, size, startAngle, endAngle);
    context.fill();
  }

  renderWall(wall: Wall) {
    const x = World.WIDTH / 2;
    const y = World.HEIGHT / 2;
    const context = this.context;
    // Destructuring assignment does not work in Node/mocha
    const endGate = wall.endGate;
    const radius = wall.radius;
    const startGate = wall.startGate;

    // FIXME: Read from hero instance
    // const hit = false;
    // context.strokeStyle = hit ? 'red' : 'black';

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
