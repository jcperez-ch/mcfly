/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { flaxs } from '../src/Flaxs';
import Store from '../src/Store';
import ActionsFactory from '../src/ActionsFactory';

chai.use(spies);

describe('Flaxs', () => {
  const TestConstants = {
    TEST_ADD: 'TEST_ADD',
    TEST_REMOVE: 'TEST_REMOVE',
    TEST_CONSUME: 'TEST_CONSUME',
  };

  const testItems = [];

  const mockStore = flaxs.createStore({
    getItems: () => testItems,
  }, function payloadFunction(payload) {
    expect(this).to.equal(mockStore);
    switch (payload.actionType) {
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

  const mockActionsFactory = flaxs.createActions({
    add: item => ({
      actionType: TestConstants.TEST_ADD,
      item,
    }),
    remove: item => ({
      actionType: TestConstants.TEST_REMOVE,
      item,
    }),
    consume: value => ({
      actionType: TestConstants.TEST_CONSUME,
      value,
    }),
  });

  const mockSyncActionsFactory = flaxs.createActions({
    add: item => ({
      actionType: TestConstants.TEST_ADD,
      item,
    }),
    remove: item => ({
      actionType: TestConstants.TEST_REMOVE,
      item,
    }),
  }, false);

  flaxs.createReducer('reducer', (state, { actionType, item }) => {
    switch (actionType) {
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
    expect(flaxs.dispatcher).to.not.be.undefined;
  });

  it('should create a new Store when createStore is called', () => {
    expect(mockStore instanceof Store).to.be.true;
  });

  it('should store created Stores in a stores property', () => {
    expect(flaxs.stores.indexOf(mockStore) !== -1).to.be.true;
  });

  it('should register created Stores with the Dispatcher and store the token', () => {
    expect(mockStore.getDispatchToken()).to.match(/ID_\d+/);
  });

  it('should create a new ActionsFactory when createActions is called', () => {
    expect(mockActionsFactory instanceof ActionsFactory).to.be.true;
  });

  it('should store created ActionsFactory methods in an actions property', () => {
    expect('add' in flaxs.actions).to.be.true;
  });

  it('should digest the correct payload in the store when it is dispatched', async () => {
    const testItem = 'test';

    await mockActionsFactory.add(testItem);
    expect(mockStore.getItems()).to.eql([testItem]);

    await mockActionsFactory.remove(testItem);
    expect(mockStore.getItems()).to.be.empty;
  });

  it('should createReducers for the MasterStore', () => {
    expect(Object.keys(flaxs.reducers).length).to.equal(1);
    expect(flaxs.store.state).to.eql({
      reducer: {
        adds: 1,
        removes: 1,
      },
    });
  });

  it('should register the reducer with a token ID in MasterStore', () => {
    expect(flaxs.store.getDispatchTokens('reducer').length).to.equal(1);
    expect(flaxs.store.getDispatchTokens('reducer')[0]).to.match(/ID_\d+/);
    expect(flaxs.store.getDispatchTokens(['reducer']).length).to.equal(1);
  });

  it('should digest the correct payload in the reducer when it is dispatched', async () => {
    const testItem = 5;

    await mockActionsFactory.add(testItem);
    expect(flaxs.store.state.reducer.adds).to.equal(6);

    await mockActionsFactory.remove(testItem);
    expect(flaxs.store.state.reducer.removes).to.equal(6);
  });

  it(`should emit a single change in master store if multiple reducers changed
    the state`, async () => {
    flaxs.store.emitChange = chai.spy(flaxs.store.emitChange);
    flaxs.createReducer('consumer', (state, { actionType, value }) => {
      switch (actionType) {
        case TestConstants.TEST_CONSUME:
          return value === 5 ? value : state;
        default:
      }
      return state;
    }, 0);

    flaxs.createReducer('consumed', (state, { actionType, value }) => {
      switch (actionType) {
        case TestConstants.TEST_CONSUME:
          return value === 0 ? state : state + 1;
        default:
      }
      return state;
    }, 0);

    flaxs.createReducer('flags', (state, { actionType, value }) => {
      switch (actionType) {
        case TestConstants.TEST_CONSUME:
          return value === 0 || value === 5 ? state : { consumed: value };
        default:
      }
      return state;
    }, { consumed: 0 });

    await mockActionsFactory.consume(9);
    expect(flaxs.store.state.flags).to.eql({ consumed: 9 });
    expect(flaxs.store.emitChange).to.have.been.called.once;

    await mockActionsFactory.consume(0);
    expect(flaxs.store.state.flags).to.eql({ consumed: 9 });
    expect(flaxs.store.emitChange).to.have.been.called.once;

    await mockActionsFactory.consume(2);
    expect(flaxs.store.state.flags).to.eql({ consumed: 2 });
    expect(flaxs.store.emitChange).to.have.been.called.twice;

    await mockActionsFactory.consume(5);
    expect(flaxs.store.state.flags).to.eql({ consumed: 2 });
    expect(flaxs.store.emitChange).to.have.been.called.exactly(3);
  });

  it('should synchronously dispatch actions', () => {
    const testItem = 2;

    expect(flaxs.store.state.reducer.adds).to.equal(6);
    mockSyncActionsFactory.add(testItem);
    expect(flaxs.store.state.reducer.adds).to.equal(8);

    mockSyncActionsFactory.remove(testItem);
    expect(flaxs.store.state.reducer.removes).to.equal(8);
  });
});
