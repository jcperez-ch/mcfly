// __tests__/Store-test.js

jest.dontMock('../Store');
jest.dontMock('../Flaxs');
jest.dontMock('../Dispatcher');

describe('Store', () => {

  const { default: Store } = require('../Store');

  let mockStore = new Store({
    testMethod: () => true,
  }, ({ actionType }) => {
    switch(actionType) {
      case 'ADD_TEST':
        return true;
      break;
    }
  });

  it('should return a new instance with methods attached via the methods argument', () => {

    expect(mockStore.testMethod).toBeDefined();

  });

  it('should attach the supplied callback to the new instance', () => {

    expect(mockStore.callback).toBeDefined();

  });

  it('should be merged with EventEmitter', () => {

    expect("on" in mockStore).toEqual(true);
    expect("removeListener" in mockStore).toEqual(true);
    expect("emit" in mockStore).toEqual(true);

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
        callback: function(){
          return true;
        }
      },function(payload){});
    }).toThrow();

  });

  it('should throw if a supplied method is named "mixin"', () => {

    expect(() => {
      Store.constructor({
        mixin: function(){
          return true;
        }
      },function(payload){});
    }).toThrow();

  });

  describe('MasterStore', () => {
    const { createStore } = require('../Flaxs');
    let flaxs;

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
