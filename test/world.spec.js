'use strict';
const chai = require('chai');
const expect = chai.expect;
const spy = require('chai-spies');

chai.use(spy);

const World = require('./world').World;

describe('World', () => {

  before(() => {
    require('jsdom-global')();
  });

  it('has a GATESIZE', () => {
    expect(World.GATESIZE).to.be.above(0);
  });

  it('has a positive HEIGHT', () => {
    expect(World.HEIGHT).to.be.above(0);
  });

  it('has a positive WIDTH', () => {
    expect(World.WIDTH).to.be.above(0);
  });

  it('has a positive USERSIZE', () => {
    expect(World.USERSIZE).to.be.above(0);
  });

  it('has a positive USERROTATION', () => {
    expect(World.USERROTATION).to.be.above(0);
  });

  it('has a positive USERVELOCITY', () => {
    expect(World.USERVELOCITY).to.be.above(0);
  });

  it('has a positive WALLDISTANCE', () => {
    expect(World.WALLDISTANCE).to.be.above(0);
  });

  describe('DOM methods', () => {
    afterEach(() => {
      const children = Array.from(window.document.body.children);
      children.forEach((child) => {
        window.document.body.removeChild(child);
      });
    });

    it('creates DOM elements', () => {
      const body = window.document.body;
      const id = 'mygame';

      expect(body).to.not.be.null;
      expect(body.children.length).to.equal(0);

      const element = World.create(id);
      const idElement = window.document.getElementById(id);

      expect(body.children.length).to.be.above(0);
      expect(idElement).to.exist;
      expect(element).to.equal(idElement);
    });

    it('renders the scene', () => {
      const id = 'mygame';
      const world = new World(id);
      const context = world.context;
      const heroMock = {};
      const wallsMock = [];
      expect(context).to.not.be.null;

      const clearRectSpy = chai.spy.on(context, 'clearRect');
      const beginPathSpy = chai.spy.on(context, 'beginPath');

      world.render(heroMock, wallsMock);
      expect(clearRectSpy).to.have.been.called.once;
      expect(beginPathSpy).to.have.been.called.exactly(wallsMock.length + 1);
    });
  });
});
