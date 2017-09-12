//@flow
import type { IAction } from './store';
import { Helper } from './helper';

export interface IHeroState {
  angle: number;
  radius: number;
}

export class Types {
  static get moveDown() {  return 'HERO_MOVES_DOWN'; }
  static get moveLeft() {  return 'HERO_MOVES_LEFT'; }
  static get moveRight() { return 'HERO_MOVES_RIGHT'; }
  static get moveUp() {    return 'HERO_MOVES_UP'; }
}

export class Actions {
  static moveDown(payload): IAction {
    const distance = payload.distance;
    return {
      type: Types.moveDown,
      payload: { radius: payload.radius - distance }
    };
  }

  static moveLeft(payload): IAction {
    const distance = Helper.mapDegreeToRadians(3 * payload.distance);
    return {
      type: Types.moveLeft,
      payload: { angle: payload.angle - distance }
    };
  }

  static moveRight(payload): IAction {
    const distance = Helper.mapDegreeToRadians(3 * payload.distance);
    return {
      type: Types.moveRight,
      payload: { angle: payload.angle + distance }
    };
  }

  static moveUp(payload): IAction {
    const distance = payload.distance;
    return {
      type: Types.moveUp,
      payload: { radius: payload.radius + distance }
    };
  }
}

export const initialState: IHeroState = {
  angle: 0,
  radius: 0,
};

export function reduce(state, action: IAction) {
  if (!state) {
    return initialState;
  }

  switch (action.type) {
    case Types.moveDown:
    case Types.moveLeft:
    case Types.moveRight:
    case Types.moveUp:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
