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

    const container = World.createContainer();
    const level = World.createLevel();
    const label = World.createAngleInput();
    container.appendChild(level);
    container.appendChild(label);
    window.document.body.appendChild(container);
    return canvas;
  }

  static createAngleInput(): HTMLElement {
    const label = window.document.createElement('label');
    const labelText = window.document.createTextNode('Angle in degree');
    const input = window.document.createElement('input');
    input.setAttribute('id', 'angle');
    input.setAttribute('min', '1');
    input.setAttribute('type', 'number');
    input.setAttribute('value', '5');
    label.appendChild(labelText);
    label.appendChild(input);
    return label;
  }

  static createCanvas(id: string): HTMLCanvasElement {
    const element = window.document.createElement('canvas');
    element.setAttribute('id', id);
    element.setAttribute('height', `${World.HEIGHT}px`);
    element.setAttribute('width', `${World.WIDTH}px`);
    return element;
  }

  static createContainer(): HTMLElement {
    const container = window.document.createElement('div');
    return container;
  }

  static createLevel(): HTMLElement {
    const label = window.document.createElement('label');
    const labelText = window.document.createTextNode('Level');
    const input = window.document.createElement('input');
    input.setAttribute('id', 'level');
    input.setAttribute('min', '1');
    input.setAttribute('type', 'number');
    input.setAttribute('value', '5');
    label.appendChild(labelText);
    label.appendChild(input);
    return label;
  }

  static get GATESIZE(): number {
    //return 1.05 * World.USERSIZE;
    return 0.15;
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
    /*
    const input = window.document.getElementById('level');
    const level = parseInt(input.value, 10);
    const scaling = 0.5 / (level + 1);
    return scaling * (World.HEIGHT + World.WIDTH) / 2;
    */
   return 0.06 * (World.HEIGHT + World.WIDTH) / 2;
  }

  static get WIDTH(): number {
    return Math.min(window.innerHeight, window.innerWidth);
  }

  static updateTimer(elapsedTime) {
    const elapsedContainer = window.document.getElementById('elapsed');
    elapsedContainer.innerText = elapsedTime;
  }

  // render(hero: Hero, walls: Wall[]) {
  render() {
    const context = this.context;
    const leftEdge = 0;
    const topEdge = 0;
    context.clearRect(leftEdge, topEdge, World.WIDTH, World.HEIGHT);
    /*
    walls.forEach((wall) => { this.renderWall(wall); });
    this.renderHero(hero);
    */
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
