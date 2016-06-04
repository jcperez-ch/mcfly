import Dispatcher from './Dispatcher';
import Store, { MasterStore } from './Store';
import ActionsFactory from './ActionsFactory';
import { assign, difference, every, get, reduce } from 'lodash';

/**
 * Main McFly Class
 */
class Flaxs {

  /**
   * Instatiates McFly along with actions object, stores array and sets
   * dispatcher to Dispatcher.
   *
   * @constructor
   */
  constructor(initialState = {}) {
    this.actions = {};
    this.stores = [];
    this.reducers = {};
    this.dispatcher = Dispatcher;
    this.store = new MasterStore(initialState);
  }

  /**
   * Creates an instance of a Store, registers the supplied callback with the
   * dispatcher, and pushes it into the global list of stores
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @return {object} - Returns instance of Store
   */
  createStore(methods, callback, initialState = {}) {
    const store = new Store(methods, callback, initialState);
    store.dispatcherID = this.dispatcher.register(store.callback.bind(store));

    this.stores.push(store);
    return store;
  }

  /**
   * Creates an instance of an ActionsFactory and adds the supplied actions
   * to the global list of actions
   *
   * @param {object} actions - Action methods
   * @return {object} - Returns instance of ActionsFactory
   */
  createActions(actions) {
    const actionFactory = new ActionsFactory(actions);
    assign(this.actions, actionFactory);
    return actionFactory;
  }

  /**
.  * a Reducer is a function of a form function(<Object> state, <Object> payload)
   * When Registering a reducer
   * @param  {string}   namespace
   * @param  {function} reducer
   * @param  {object}   initialState = {}
   * @return {object} - Returns an instance of
   */
  createReducer(namespace, reducer, initialState = {}) {
    this.store.mergeState(namespace, initialState);
    const dispatcherID = this.dispatcher.register((payload) => {
      const dispatcherHandled = get(this.dispatcher, '_isHandled');
      const pendingReducers = reduce(
        dispatcherHandled, (accPending, isHandled, pendingDispatcherID) => {
          const isPending = !isHandled && dispatcherID !== pendingDispatcherID;
          const isFromStore = every(
            this.stores, (store) => store.dispatcherID !== pendingDispatcherID
          );
          if (isPending && isFromStore) {
            accPending.push(pendingDispatcherID);
          }
          return accPending;
        }, []
      );
      const restOfReducers = difference(this.store.getDispatchTokens(), [dispatcherID]);
      if (restOfReducers.length === pendingReducers.length) {
        this.store.freezeState();
      }
      const state = Object.freeze(reducer(this.store.state[namespace], payload));

      if (state !== this.store.state[namespace]) {
        this.store.mergeState(namespace, state);
      }

      if (pendingReducers.length === 0) {
        this.store.emitChangeIfStoreChanged();
      }

      return true;
    });
    this.store.addDispatcherId(namespace, dispatcherID);
    this.reducers[namespace] = reducer;
    return this;
  }
}

const flaxs = new Flaxs();

export default Flaxs;
export { flaxs };
