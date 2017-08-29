import { expect } from 'chai';
import { World } from './world';

console.log('Testing world');
describe('World', () => {
  it('has a positive height', () => {
    expect(World.HEIGHT).to.be.greater.than(0);
  });
});
