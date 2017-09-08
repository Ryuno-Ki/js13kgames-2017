'use strict';
const chai = require('chai');
const expect = chai.expect;
const chaiInterface = require('chai-interface');
const spies = require('chai-spies');

chai.use(chaiInterface);
chai.use(spies);

const Swipe = require('./swipe').Swipe;

describe('Swipe', () => {
  const elementMock = { addEventListener: () => { return null; } };
  const callbacksMock = {
    onDown: () => { return null; },
    onLeft: () => { return null; },
    onRight: () => { return null; },
    onUp: () => { return null; }
  };

  it('has an element property', () => {
    const swipe = new Swipe(elementMock, callbacksMock);
    expect(swipe.element).to.be.defined;
  });

  it('waits for a swipe move, before calling back', () => {
    const onDownSpy = chai.spy.on(callbacksMock, 'onDown');
    const onLeftSpy = chai.spy.on(callbacksMock, 'onLeft');
    const onRightSpy = chai.spy.on(callbacksMock, 'onRight');
    const onUpSpy = chai.spy.on(callbacksMock, 'onUp');

    const touchMoveEventMock = {
        touches: [{ clientX: 1, clientY: 1 }]
      };
      const swipe = new Swipe(elementMock, callbacksMock);

      swipe.onTouchMove(touchMoveEventMock);
      expect(onDownSpy).to.not.have.been.called;
      expect(onLeftSpy).to.not.have.been.called;
      expect(onRightSpy).to.not.have.been.called;
      expect(onUpSpy).to.not.have.been.called;
  });

  describe('in direction', () => {
    const onDownSpy = chai.spy.on(callbacksMock, 'onDown');
    const onLeftSpy = chai.spy.on(callbacksMock, 'onLeft');
    const onRightSpy = chai.spy.on(callbacksMock, 'onRight');
    const onUpSpy = chai.spy.on(callbacksMock, 'onUp');

    it('towards down', () => {
      const touchStartEventMock = {
        touches: [{ clientX: 1, clientY: 1 }]
      };
      const touchMoveEventMock = {
        touches: [{ clientX: 1, clientY: 3 }]
      };
      const swipe = new Swipe(elementMock, callbacksMock);

      swipe.onTouchStart(touchStartEventMock);
      swipe.onTouchMove(touchMoveEventMock);
      expect(onDownSpy).to.have.been.called.once;
    });

    it('towards left', () => {
      const touchStartEventMock = {
        touches: [{ clientX: 3, clientY: 1 }]
      };
      const touchMoveEventMock = {
        touches: [{ clientX: 1, clientY: 1 }]
      };
      const swipe = new Swipe(elementMock, callbacksMock);

      swipe.onTouchStart(touchStartEventMock);
      swipe.onTouchMove(touchMoveEventMock);
      expect(onLeftSpy).to.have.been.called.once;
    });

    it('towards right', () => {
      const touchStartEventMock = {
        touches: [{ clientX: 1, clientY: 1 }]
      };
      const touchMoveEventMock = {
        touches: [{ clientX: 3, clientY: 1 }]
      };
      const swipe = new Swipe(elementMock, callbacksMock);

      swipe.onTouchStart(touchStartEventMock);
      swipe.onTouchMove(touchMoveEventMock);
      expect(onRightSpy).to.have.been.called.once;
    });

    it('towards up', () => {
      const touchStartEventMock = {
        touches: [{ clientX: 1, clientY: 3 }]
      };
      const touchMoveEventMock = {
        touches: [{ clientX: 1, clientY: 1 }]
      };
      const swipe = new Swipe(elementMock, callbacksMock);

      swipe.onTouchStart(touchStartEventMock);
      swipe.onTouchMove(touchMoveEventMock);
      expect(onDownSpy).to.have.been.called.once;
    });
  });
});
