//@flow
import { Helper } from './helper';
import type { ICartesianSystem } from './helper';

interface IGate {
  end: number;
  start: number;
}

export interface IWallState {
  radius: number;
  gate: IGate;
}

export class Types {
  static get randomiseGate() { return 'WALL_RANDOMISE_GATE'; }
  static get setRadius() { return 'WALL_SET_RADIUS'; }
}

export class Actions {
  static _getRandomStart(): number {
    return 2 * Math.PI * Math.random();
  }

  static _getRandomEnd(start: number, width: number): number {
    return Helper.normaliseAngle(start + width);
  }

  static randomiseGate(width: number): IAction {
    const randomStart = Actions._getRandomStart();
    const randomEnd = Actions._getRandomEnd(randomStart, width);
    // console.log(`${randomEnd} - ${randomStart} == ${width}?`);

    return {
      type: Types.randomiseGate,
      payload: { gate: { start: randomStart, end: randomEnd } }
    };
  }

  static setRadius(radius: number): IAction {
    return {
      type: Types.setRadius,
      payload: { radius: radius },
    };
  }
}

export const initialState: IWallState = {
  radius: 1,
  gate: {
    end: 1,
    start: 0,
  }
};

export function reduce(state, action: IAction) {
  if (!state) {
    return initialState;
  }

  switch (action.type) {
    case Types.randomiseGate:
    case Types.setRadius:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
