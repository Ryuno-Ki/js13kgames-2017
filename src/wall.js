import { Helper } from './helper';

export class Wall {
  randomiseGate() {
    const fullCircleInRadians = 2 * Math.PI;
    const gate = Math.random() * fullCircleInRadians;
    const startAngle = 0 + gate;
    const endAngle = Helper.normaliseAngle(startAngle + 0.1 * fullCircleInRadians);

    return {
      end: endAngle,
      start: startAngle,
    };
  }

  render(context, x, y) {
    // Since the gate shall be spared out from circle, switch its start
    // and end when drawing the arc
    context.beginPath();
    context.arc(x, y, this.radius, this.endGate, this.startGate);
    context.stroke();
  }

  constructor(radius) {
    const { start, end } = this.randomiseGate();

    this.radius = radius;
    this.startGate = start;
    this.endGate = end;
  }
}
