//@flow
import type { IAction } from './store';

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
  static moveDown(distance: number): IAction {
    return {
      type: Types.moveDown,
      payload: { radius: -distance }
    };
  }

  static moveLeft(distance: number): IAction {
    return {
      type: Types.moveLeft,
      payload: { angle: -distance }
    };
  }

  static moveRight(distance: number): IAction {
    return {
      type: Types.moveRight,
      payload: { angle: distance }
    };
  }

  static moveUp(distance: number): IAction {
    return {
      type: Types.moveUp,
      payload: { radius: distance }
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
