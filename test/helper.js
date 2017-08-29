//     
import { World } from './world';

                                   
            
            
 

                                      
            
            
 

                       
              
            
 

export class Helper {
  static coordinationSystemToCenter(p        , q        )                   {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const x = p - World.WIDTH / 2;
    const y = q - World.HEIGHT / 2;
    return { x, y };
  }

  static coordinationSystemToVertex(x        , y        )                      {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const p = x + World.WIDTH / 2;
    const q = y + World.HEIGHT / 2;
    return { p, q };
  }

  static euclideanDistance(x        , y        )         {
    return Math.sqrt(x * x + y * y);
  }

  static mapCartesianToPolar(cartesian                  )              {
    // Destructuring assignment does not work in Node/mocha
    const x = cartesian.x;
    const y = cartesian.y;
    const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const phi = Math.atan2(y, x);
    return { r, phi };
  }

  static mapDegreeToRadians(degree        ) {
    // degree : 360 = radians : 2 * Math.PI
    return degree * Math.PI / 180;
  }

  static mapPolarToCartesian(polar             )                   {
    // Destructuring assignment does not work in Node/mocha
    const phi = polar.phi;
    const r = polar.r;
    const x = r * Math.cos(phi);
    const y = r * Math.sin(phi);
    return { x, y };
  }

  static mapRadiansToDegree(radians        ) {
    // degree : 360 = radians : 2 * Math.PI
    return radians * 180 / Math.PI;
  }

  static normaliseAngle(angle        )         {
    const fullCircleInRadians = 2 * Math.PI;
    if (angle < 0) {
      return (angle + fullCircleInRadians) % fullCircleInRadians;
    }
    return angle % fullCircleInRadians;
  }
}
