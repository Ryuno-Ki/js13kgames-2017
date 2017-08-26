//@flow
import { World } from './world';

export interface CartesianSystem {
  x: number;
  y: number;
}

export interface CoordinationSystem {
  p: number;
  q: number;
}

interface PolarSystem {
  phi: number;
  r: number;
}

export class Helper {
  static coordinationSystemToCenter(p: number, q: number): CartesianSystem {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const x = p - World.WIDTH / 2;
    const y = q - World.HEIGHT / 2;
    return { x, y };
  }

  static coordinationSystemToVertex(x: number, y: number): CoordinationSystem {
    // (p, q) are measured from top-left corner
    // (x, y) are center of circles
    const p = x + World.WIDTH / 2;
    const q = y + World.HEIGHT / 2;
    return { p, q };
  }

  static euclideanDistance(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  static mapCartesianToPolar(cartesian: CartesianSystem): PolarSystem {
    const { x, y } = cartesian;
    const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    const phi = Math.atan2(y, x);
    return { r, phi };
  }

  static mapPolarToCartesian(polar: PolarSystem): CartesianSystem {
      const { r, phi } = polar;
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      return { x, y };
  }

  static normaliseAngle(angle: number): number {
    const fullCircleInRadians = 2 * Math.PI;
    return angle % fullCircleInRadians;
  }
}
