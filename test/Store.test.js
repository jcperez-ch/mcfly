/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import Store from '../src/Store';
import { flaxs } from '../src/Flaxs';

describe('Store', () => {
  const mockStore = new Store({
    testMethod: () => true,
  }, ({ actionType }) => {
    switch (actionType) {
      case 'ADD_TEST':
        return true;
      default:
        return true;
    }
  });

  function mockDispatchCallback({ actionType, ...params }) {
    let newState;
    switch (actionType) {
      case 'READY':
        newState = { ...this.state, loaded: true };
        break;
      case 'ADD':
        if (!this.state.todos.includes(params.item)) {
          newState = {
            ...this.state,
            todos: [
              ...this.state.todos,
              params.item,
            ],
          };
        }
        break;
      default:
        return true;
    }
    const currentState = this.emitChangeIfStoreChanged(newState);
    expect(currentState.loaded).to.be.true;
    return true;
  }

  const mockStoreWithState = flaxs.createStore({
    testMethod: () => true,
  }, mockDispatchCallback, {
    loaded: false,
    todos: [],
  });

  it('should return a new instance with methods attached via the methods argument', () => {
    expect(mockStore.testMethod).to.be.defined;
  });

  it('should attach the supplied callback to the new instance', () => {
    expect(mockStore.callback).to.be.defined;
  });

  it('should be merged with EventEmitter', () => {
    expect('on' in mockStore).to.be.true;
    expect('removeListener' in mockStore).to.be.true;
    expect('emit' in mockStore).to.be.true;
  });

  it('should create a mixin property', () => {
    expect(mockStore.mixin).to.be.defined;
  });

  it('should return a dispatcherID when getDispatchToken is called', () => {
    mockStore.dispatcherID = 5;
    expect(mockStore.getDispatchToken()).to.equal(5);
  });

  it('should throw if a supplied method is named "callback"', () => {
    expect(() => {
      Store.constructor({
        callback: () => true,
      }, () => {});
    }).to.throw(/.*/);
  });

  it('should throw if a supplied method is named "mixin"', () => {
    expect(() => {
      Store.constructor({
        mixin: () => true,
      }, () => {});
    }).to.throw(/.*/);
  });

  it('should store values on the state', () => {
    expect(mockStoreWithState.state).to.not.be.undefined;
    const beforeReadyState = mockStoreWithState.state;
    flaxs.dispatcher.dispatch({
      actionType: 'READY',
    });
    expect(mockStoreWithState.state).to.not.equal(beforeReadyState);

    flaxs.dispatcher.dispatch({
      actionType: 'ADD',
      item: 'First Item',
    });

    expect(mockStoreWithState.state.todos.length).to.equal(1);
  });

  describe('MasterStore', () => {
    beforeEach(() => {
      flaxs.store.mergeState('startingWith', 'test');
    });

    it('should have an already defined store', () => {
      expect(flaxs.store.state).to.not.be.undefined;
      expect(flaxs.store.state.startingWith).to.equal('test');
    });

    it('should merge states', () => {
      flaxs.store.mergeState('user', { info: null });

      expect(flaxs.store.state.user).to.eql({ info: null });
    });

    it('should contain frozen referenced objects', () => {
      flaxs.store.mergeState('user', { info: {
        status: 'ACTIVE',
        userType: 'GUEST',
      } });

      expect(Object.isFrozen(flaxs.store.state)).to.be.true;
      expect(Object.isFrozen(flaxs.store.state.startingWith)).to.be.true;
      expect(Object.isFrozen(flaxs.store.state.user)).to.be.true;
      expect(Object.isFrozen(flaxs.store.state.user.info)).to.be.false;
    });

    it('should create a tree object if the namespace contains dots', () => {
      flaxs.store.mergeState('user', {
        status: 'ACTIVE',
        userType: 'GUEST',
      });

      flaxs.store.mergeState('user.preferences', {
        language: 'en',
        color: 'blue',
        notifications: { push: true, browser: false },
      });

      expect(flaxs.store.state.user).to.eql({
        status: 'ACTIVE',
        userType: 'GUEST',
        preferences: {
          language: 'en',
          color: 'blue',
          notifications: { push: true, browser: false },
        },
      });

      expect(Object.isFrozen(flaxs.store.state)).to.be.true;
      expect(Object.isFrozen(flaxs.store.state.user)).to.be.true;
      expect(Object.isFrozen(flaxs.store.state.user.preferences)).to.be.true;
      expect(Object.isFrozen(flaxs.store.state.user.preferences.notifications)).to.be.false;
    });

    it('shold get the dispatcherIds according to its namespace', () => {
      const countReducers = flaxs.store.getDispatchTokens().length;

      flaxs.createReducer('one', state => state, { pointOne: 1.1, pointTwo: 1.2 });
      flaxs.createReducer('two', state => state, { pointTwo: 2.2, pointThree: 2.3 });
      flaxs.createReducer('three', state => state, { pointOne: 3.1, pointThree: 3.3 });

      expect(flaxs.store.getDispatchTokens().length).to.equal(countReducers + 3);
      expect(flaxs.store.getDispatchTokens('two')).to.eql([flaxs.store.dispatcherIds.two]);
      expect(flaxs.store.getDispatchTokens(['one', 'three'])).to.eql([
        flaxs.store.dispatcherIds.one,
        flaxs.store.dispatcherIds.three,
      ]);
    });
  });
});
