//@flow
import { World } from './world';

export interface ICartesianSystem {
  x: number;
  y: number;
}

export interface ICoordinationSystem {
  p: number;
  q: number;
}

interface PolarSystem {
  phi: number;
  r: number;
}

export class Helper {
  static coordinationSystemToCenter(p: number, q: number): ICartesianSystem {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const x = p - World.WIDTH / 2;
    const y = q - World.HEIGHT / 2;
    return { x, y };
  }

  static coordinationSystemToVertex(x: number, y: number): ICoordinationSystem {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const p = x + World.WIDTH / 2;
    const q = y + World.HEIGHT / 2;
    return { p, q };
  }

  static euclideanDistance(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  static mapCartesianToPolar(cartesian: ICartesianSystem): PolarSystem {
    const { x, y } = cartesian;
    const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const phi = Math.atan2(y, x);
    return { r, phi };
  }

  static mapDegreeToRadians(degree: number) {
    // degree : 360 = radians : 2 * Math.PI
    return degree * Math.PI / 180;
  }

  static mapPolarToCartesian(polar: PolarSystem): ICartesianSystem {
      const { r, phi } = polar;
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      return { x, y };
  }

  static mapRadiansToDegree(radians: number) {
    // degree : 360 = radians : 2 * Math.PI
    return radians * 180 / Math.PI;
  }

  static normaliseAngle(angle: number): number {
    const fullCircleInRadians = 2 * Math.PI;
    if (angle < 0) {
      return (angle + fullCircleInRadians) % fullCircleInRadians;
    }
    return angle % fullCircleInRadians;
  }
}
