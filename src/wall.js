//@flow
import { CartesianSystem, Helper } from './helper';

interface Gate {
  end: number;
  start: number;
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

  /* FIXME: context should be of type CanvasRenderingContext2d */
  render(context: any, cartesian: CartesianSystem) {
    const { x, y } = cartesian;
    // Since the gate shall be spared out from circle, switch its start
    // and end when drawing the arc
    context.beginPath();
    context.arc(x, y, this.radius, this.endGate, this.startGate);
    context.stroke();
  }

  constructor(radius: number) {
    const { start, end } = Wall.randomiseGate();

    this.radius = radius;
    this.startGate = start;
    this.endGate = end;
  }
}
