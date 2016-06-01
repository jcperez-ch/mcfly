// __tests__/Store-test.js

jest.dontMock('../Flaxs');
jest.dontMock('../Store');
jest.dontMock('../ActionsFactory');
jest.dontMock('../Action');
jest.dontMock('../Dispatcher');


describe('Flaxs', () => {

  var flaxs = require('../Flaxs').flaxs;
  var Store = require('../Store').default;
  var ActionsFactory = require('../ActionsFactory').default;
  var TestConstants = {
    TEST_ADD: 'TEST_ADD',
    TEST_REMOVE: 'TEST_REMOVE'
  };

  var flaxs, mockStore, mockActionsFactory;
  const testItems = [];

  mockStore = flaxs.createStore({
    getItems: () => testItems,
  }, function(payload) {
    switch(payload.actionType) {
      case TestConstants.TEST_ADD:
        testItems.push(payload.item);
      break;
      case TestConstants.TEST_REMOVE:
        testItems.splice(testItems.indexOf(payload.item), 1);
      break;
      default:
        return true;
    }
    return true;
  });

  mockActionsFactory = flaxs.createActions({
    add: function(item) {
      return {
        actionType: TestConstants.TEST_ADD,
        item,
      }
    },
    remove: function(item) {
      return {
        actionType: TestConstants.TEST_REMOVE,
        item,
      }
    }
  });

  flaxs.createReducer('reducer', (state, { actionType, item }) => {
    switch(actionType) {
      case TestConstants.TEST_ADD: {
        const adds = state.adds + (typeof item === 'number' ? item : 1);
        return { ...state, adds };
      }
      case TestConstants.TEST_REMOVE: {
        const removes = state.removes + (typeof item === 'number' ? item : 1);
        return { ...state, removes };
      }
      default:
    }
    return state;
  }, {
    adds: 0,
    removes: 0,
  });

  it('should instantiate a new dispatcher and attach it to the new instance', () => {

    expect(flaxs.dispatcher).toBeDefined();

  });

  it('should create a new Store when createStore is called', () => {

    expect(mockStore instanceof Store).toEqual(true);

  });

  it('should store created Stores in a stores property', () => {

    expect(flaxs.stores.indexOf(mockStore) !== -1).toEqual(true);

  });

  it('should register created Stores with the Dispatcher and store the token', () => {

    expect(mockStore.getDispatchToken()).toMatch(/ID_\d+/);

  });

  it('should create a new ActionsFactory when createActions is called', () => {

    expect(mockActionsFactory instanceof ActionsFactory).toEqual(true);

  });

  it('should store created ActionsFactory methods in an actions property', () => {

    expect("add" in flaxs.actions).toEqual(true);

  });

  pit('should digest the correct payload in the store when it is dispatched', async () => {

    const testItem = 'test';

    await mockActionsFactory.add(testItem);
    expect(mockStore.getItems()).toEqual([testItem]);

    await mockActionsFactory.remove(testItem);
    expect(mockStore.getItems()).toEqual([]);

  });

  it('should createReducers for the MasterStore', () => {
    expect(Object.keys(flaxs.reducers).length).toEqual(1);
    expect(flaxs.store.state).toEqual({
      reducer: {
        adds: 1,
        removes: 1,
      },
    });
  });

  it('should register the reducer with a token ID in MasterStore', () => {
    expect(flaxs.store.getDispatchTokens('reducer').length).toBe(1);
    expect(flaxs.store.getDispatchTokens('reducer')[0]).toMatch(/ID_\d+/);
    expect(flaxs.store.getDispatchTokens(['reducer']).length).toBe(1);
  });

  pit('should digest the correct payload in the reducer when it is dispatched', async () => {

    const testItem = 5;

    await mockActionsFactory.add(testItem);
    expect(flaxs.store.state.reducer.adds).toEqual(6);

    await mockActionsFactory.remove(testItem);
    expect(flaxs.store.state.reducer.removes).toEqual(6);
  });
});
