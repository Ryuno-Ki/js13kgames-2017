//@flow
export interface HeroState {
  angle: number;
  name: string;
  radius: number;
  timeElapsed: string;
}

export class Hero {
  /* Properties */
  radius: number;
  step: number;
  x: number;
  y: number;

  moveLeft() {
    this.x -= this.step;
  }

  moveRight() {
    this.x += this.step;
  }

  moveUp() {
    this.y -= this.step;
  }

  moveDown() {
    this.y += this.step;
  }

  /* FIXME: context should be of type CanvasRenderingContext2d */
  render(context: any) {
    const fullCircleInRadians = 2 * Math.PI;
    const startAngle = 0;
    const endAngle = 0.9 * fullCircleInRadians;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, startAngle, endAngle);
    context.fill();
  }

  constructor(diameter: number, x: number, y: number) {
    this.radius = diameter / 2;
    this.step = 5;
    this.x = x;
    this.y = y;
  }
}
