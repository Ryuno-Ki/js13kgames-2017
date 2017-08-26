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

  static get HEIGHT(): number {
    return 300;
  }

  static get USERSIZE(): number {
    return 0.01 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get USERROTATION(): number {
    return 2.5;
    // return 0.02 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get USERVELOCITY(): number {
    return 3;
    // return 0.05 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get WALLDISTANCE(): number {
    return 0.03 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get WIDTH(): number {
    return 300;
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
    const { x, y } = hero;

    context.beginPath();
    context.arc(x, y, size, startAngle, endAngle);
    context.fill();
  }

  renderWall(wall: Wall) {
    const x = World.WIDTH / 2;
    const y = World.HEIGHT / 2;
    const context = this.context;
    const { endGate, radius, startGate } = wall;

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
