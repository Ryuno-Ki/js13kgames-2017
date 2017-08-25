// Kudos https://stackoverflow.com/a/39545306
export class Swipe {
  handleTouchMove(event) {
    if ( ! this.xDown || ! this.yDown ) {
      return;
    }

    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if ( Math.abs( this.xDiff ) > Math.abs( this.yDiff ) ) { // Most significant.
      if ( this.xDiff > 0 ) {
        this.onLeft();
      } else {
        this.onRight();
      }
    } else {
      if ( this.yDiff > 0 ) {
        this.onUp();
      } else {
        this.onDown();
      }
    }

    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }

  onDown(callback) {
    this.onDown = callback;
    return this;
  }

  onLeft(callback) {
    this.onLeft = callback;
    return this;
  }

  onRight(callback) {
    this.onRight = callback;
    return this;
  }

  onTouchMove(event) {
    this.handleTouchMove(event);
  }

  onTouchStart(event) {
    this.xDown = event.touches[0].clientX;
    this.yDown = event.touches[0].clientY;
  }

  onUp(callback) {
    this.onUp = callback;
    return this;
  }

  run() {
    const self = this;
    const onTouchMove = self.onTouchMove;
    this.element.addEventListener('touchmove', onTouchMove.bind(self), false);
  }

  constructor(element) {
    this.xDown = null;
    this.yDown = null;
    this.element = typeof(element) === 'string' ? document.querySelector(element) : element;

    this.element.addEventListener('touchstart', this.onTouchStart.bind(this), false);

  }
}
