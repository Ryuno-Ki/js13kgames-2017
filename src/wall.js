//@flow
import { CartesianSystem, Helper } from './helper';

interface Gate {
  end: number;
  start: number;
}

export interface WallState {
  radius: number;
  gate: Gate;
}

export class Wall {
  /* properties */
  endGate: number;
  radius: number;
  startGate: number;

  static randomiseGate(): Gate {
    const fullCircleInRadians = 2 * Math.PI;
    const gate = Math.random() * fullCircleInRadians;
    const startAngle = 0 + gate;
    const endAngle = Helper.normaliseAngle(startAngle + 0.1 * fullCircleInRadians);

    return {
      end: endAngle,
      start: startAngle,
    };
  }

  constructor(radius: number) {
    const { start, end } = Wall.randomiseGate();

    this.radius = radius;
    this.startGate = start;
    this.endGate = end;
  }
}
