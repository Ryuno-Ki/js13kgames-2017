//@flow
import { Helper } from './helper';
import type { ICartesianSystem } from './helper';
import { World } from './world';

interface IGate {
  end: number;
  start: number;
}

export interface IWallState {
  radius: number;
  gate: IGate;
}

export class Wall {
  /* properties */
  endGate: number;
  radius: number;
  startGate: number;

  static randomiseGate(): IGate {
    const fullCircleInRadians = 2 * Math.PI;
    const gate = Math.random() * fullCircleInRadians;
    const startAngle = 0 + gate;
    const endAngle = Helper.normaliseAngle(
      startAngle + World.GATESIZE * fullCircleInRadians
    );

    return {
      end: endAngle,
      start: startAngle,
    };
  }

  constructor(radius: number) {
    // Destructuring assignment does not work in Node/mocha
    const randomisedGate = Wall.randomiseGate();
    const end = randomisedGate.end;
    const start = randomisedGate.start;

    this.radius = radius;
    this.startGate = start;
    this.endGate = end;
  }
}
