//     
import { Helper } from './helper';
                                   
                                   

                              
                 
                
 

export class World {
  /* properties */
                             
                                    

  static create(id        )                    {
    const element = window.document.createElement('canvas');
    element.setAttribute('id', id);
    element.setAttribute('height', `${World.HEIGHT}px`);
    element.setAttribute('width', `${World.WIDTH}px`);
    window.document.body.appendChild(element);
    return element;
  }

  static get GATESIZE()         {
    return 0.15;
  }

  static get HEIGHT()         {
    return Math.min(window.innerHeight, window.innerWidth);
  }

  static get USERSIZE()         {
    return World.WALLDISTANCE / 3;
  }

  static get USERROTATION()         {
    return Helper.mapDegreeToRadians(5);
    // return 0.02 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get USERVELOCITY()         {
    return 3;
    // return 0.05 * Helper.euclideanDistance(World.HEIGHT, World.WIDTH);
  }

  static get WALLDISTANCE()         {
    return 0.06 * (World.HEIGHT + World.WIDTH) / 2;
  }

  static get WIDTH()         {
    return Math.min(window.innerHeight, window.innerWidth);
  }

  static updateTimer(elapsedTime) {
    const elapsedContainer = window.document.getElementById('elapsed');
    elapsedContainer.innerText = elapsedTime;
  }

  render(hero      , walls        ) {
    const context = this.context;
    const leftEdge = 0;
    const topEdge = 0;
    context.clearRect(leftEdge, topEdge, World.WIDTH, World.HEIGHT);
    walls.forEach((wall) => { this.renderWall(wall); });
    this.renderHero(hero);
  }

  renderHero(hero      ) {
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

  renderWall(wall      ) {
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

  constructor(id        ) {
    this.element = World.create(id);
    this.context = this.element.getContext('2d');
  }
}
