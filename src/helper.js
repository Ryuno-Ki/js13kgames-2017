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
  // eslint-disable-next-line space-in-parens
  static coordinationSystemToCenter(p: number, q: number): ICartesianSystem {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const x = p - World.WIDTH / 2;
    const y = q - World.HEIGHT / 2;
    return { x, y };
  }

  // eslint-disable-next-line space-in-parens
  static coordinationSystemToVertex(x: number, y: number): ICoordinationSystem {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const p = x + World.WIDTH / 2;
    const q = y + World.HEIGHT / 2;
    return { p, q };
  }

  // eslint-disable-next-line space-in-parens
  static euclideanDistance(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  // eslint-disable-next-line space-in-parens
  static mapCartesianToPolar(cartesian: ICartesianSystem): PolarSystem {
    const { x, y } = cartesian;
    const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const phi = Math.atan2(y, x);
    return { r, phi };
  }

  // eslint-disable-next-line space-in-parens
  static mapPolarToCartesian(polar: PolarSystem): ICartesianSystem {
      const { r, phi } = polar;
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      return { x, y };
  }

  // eslint-disable-next-line space-in-parens
  static normaliseAngle(angle: number): number {
    const fullCircleInRadians = 2 * Math.PI;
    return angle % fullCircleInRadians;
  }
}
