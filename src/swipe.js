//@flow
interface TouchEventCallbacks {
  onDown: () => mixed;
  onLeft: () => mixed;
  onRight: () => mixed;
  onUp: () => mixed;
}

// Kudos https://stackoverflow.com/a/39545306
export class Swipe {
  /* properties */
  element: HTMLElement;
  handlers: TouchEventCallbacks;
  xDiff: number;
  yDiff: number;
  xDown: ?number;
  yDown: ?number;
  xUp: number;
  yUp: number;

  handleTouchMove(event: TouchEvent): void {
    if (!this.xDown || !this.yDown) {
      return;
    }

    const handlers = this.handlers;
    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;

    this.xDiff = this.xDown - xUp;
    this.yDiff = this.yDown - yUp;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) { // Most significant.
      if (this.xDiff > 0) {
        handlers.onLeft(this.xDiff);
      } else {
        handlers.onRight(this.xDiff);
      }
    } else {
      if (this.yDiff > 0) {
        handlers.onUp(this.yDiff);
      } else {
        handlers.onDown(this.yDiff);
      }
    }

    // Reset values.
    this.xDown = null;
    this.yDown = null;
  }

  onTouchMove(event: TouchEvent): void {
    this.handleTouchMove(event);
  }

  onTouchStart(event: TouchEvent): void {
    this.xDown = event.touches[0].clientX;
    this.yDown = event.touches[0].clientY;
  }

  run() {
    const self = this;
    const onTouchMove = self.onTouchMove;
    this.element.addEventListener('touchmove', onTouchMove.bind(self), false);
  }

  constructor(element: HTMLElement, callbacks: TouchEventCallbacks) {
    this.xDown = null;
    this.yDown = null;
    this.element = element;

    this.element.addEventListener('touchstart', this.onTouchStart.bind(this), false);

    // Destructuring assignment does not work in Node/mocha
    const onDown = callbacks.onDown;
    const onLeft = callbacks.onLeft;
    const onRight = callbacks.onRight;
    const onUp = callbacks.onUp;
    this.handlers = { onDown, onLeft, onRight, onUp };
  }
}
