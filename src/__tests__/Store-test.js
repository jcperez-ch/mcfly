// __tests__/Store-test.js
/* eslint-disable global-require */

jest.dontMock('../Store');
jest.dontMock('../Flaxs');
jest.dontMock('../Dispatcher');
jest.dontMock('../Messager');

describe('Store', () => {

  const { default: Store } = require('../Store');
  const Flaxs = require('../Flaxs').default;
  const { includes, union, isEqual } = require('lodash');
  let flaxs = new Flaxs();

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
        if (!includes(this.state.todos, params.item)) {
          newState = {
            ...this.state,
            todos: [
              ...this.state.todos,
              params.item,
            ],
          };
        }
        break;
      case 'ADD_ALL': {
        const todos = union(this.state.todos, params.items);
        if (!isEqual(this.state.todos, todos)) {
          newState = {
            ...this.state,
            todos,
          };
        }
        break;
      }
      default:
        return true;
    }
    const currentState = this.emitChangeIfStoreChanged(newState);
    expect(currentState.loaded).toBe(true);
    return true;
  }

  const mockStoreWithState = flaxs.createStore({
    testMethod: () => true,
  }, mockDispatchCallback, {
    loaded: false,
    todos: [],
  });

  it('should return a new instance with methods attached via the methods argument', () => {
    expect(mockStore.testMethod).toBeDefined();
  });

  it('should attach the supplied callback to the new instance', () => {
    expect(mockStore.callback).toBeDefined();
  });

  it('should be merged with EventEmitter', () => {
    expect('on' in mockStore).toEqual(true);
    expect('removeListener' in mockStore).toEqual(true);
    expect('emit' in mockStore).toEqual(true);
  });

  it('should create a mixin property', () => {
    expect(mockStore.mixin).toBeDefined();
  });

  it('should return a dispatcherID when getDispatchToken is called', () => {
    mockStore.dispatcherID = 5;
    expect(mockStore.getDispatchToken()).toEqual(5);
  });

  it('should throw if a supplied method is named "callback"', () => {
    expect(() => {
      Store.constructor({
        callback: () => true,
      }, () => {});
    }).toThrow();
  });

  it('should throw if a supplied method is named "mixin"', () => {
    expect(() => {
      Store.constructor({
        mixin: () => true,
      }, () => {});
    }).toThrow();
  });

  it('should store values on the state', () => {
    expect(mockStoreWithState.state).toBeDefined();
    const beforeReadyState = mockStoreWithState.state;
    flaxs.dispatcher.dispatch({
      actionType: 'READY',
    });
    expect(mockStoreWithState.state).not.toBe(beforeReadyState);

    flaxs.dispatcher.dispatch({
      actionType: 'ADD',
      item: 'First Item',
    });

    expect(mockStoreWithState.state.todos.length).toBe(1);
  });

  describe('MasterStore', () => {
    const { createStore } = require('../Flaxs');

    beforeEach(() => {
      flaxs = createStore({ name: 'test' });
    });

    it('should have an already defined store', () => {
      expect(flaxs.store.state).toBeDefined();
      expect(flaxs.store.state.name).toBe('test');
    });

    it('should merge states', () => {
      flaxs.store.mergeState('user', { info: null });

      expect(flaxs.store.state.user).toEqual({ info: null });
    });

    it('should contain frozen referenced objects', () => {
      flaxs.store.mergeState('user', { info: {
        status: 'ACTIVE',
        userType: 'GUEST',
      } });

      expect(Object.isFrozen(flaxs.store.state)).toBe(true);
      expect(Object.isFrozen(flaxs.store.state.name)).toBe(true);
      expect(Object.isFrozen(flaxs.store.state.user)).toBe(true);
      expect(Object.isFrozen(flaxs.store.state.user.info)).toBe(false);
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

      expect(flaxs.store.state.user).toEqual({
        status: 'ACTIVE',
        userType: 'GUEST',
        preferences: {
          language: 'en',
          color: 'blue',
          notifications: { push: true, browser: false },
        },
      });

      expect(Object.isFrozen(flaxs.store.state)).toBe(true);
      expect(Object.isFrozen(flaxs.store.state.user)).toBe(true);
      expect(Object.isFrozen(flaxs.store.state.user.preferences)).toBe(true);
      expect(Object.isFrozen(flaxs.store.state.user.preferences.notifications)).toBe(false);
    });
  });
});
