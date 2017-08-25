export class Hero {
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

  render(context) {
    const fullCircleInRadians = 2 * Math.PI;
    const startAngle = 0;
    const endAngle = 0.9 * fullCircleInRadians;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, startAngle, endAngle);
    context.fill();
  }

  constructor(diameter, x, y) {
    this.radius = diameter / 2;
    this.step = 5;
    this.x = x;
    this.y = y;
  }
}
