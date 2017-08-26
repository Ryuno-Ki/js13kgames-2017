//@flow
export class World {
  static create(id: string): HTMLCanvasElement {
    const element = document.createElement('canvas');
    element.setAttribute('id', id);
    element.setAttribute('height', `${this.HEIGHT}px`);
    element.setAttribute('width', `${this.WIDTH}px`);
    window.document.body.appendChild(element);
    return element;
  }

  static get HEIGHT(): number {
    return 300;
  }

  static get WIDTH(): number {
    return 300;
  }
}
