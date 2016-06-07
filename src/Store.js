import { EventEmitter } from 'events';
import iv from 'invariant';
import { assign, compact, get, includes, isArray, isString, map } from 'lodash';

/**
 * Private method used by the MasterStore to recursevely freeze the state in case
 * a reducer is created as a nested namespace.
 * @param  {string} namespace
 * @param  {object} state
 * @return {object} The recursevely frozen resulted state;
 */
const recursivelyMergeState = (initialState, namespace, state) => {
  const multilevelNamespace = namespace.match(/^[a-z\d]*\./);

  if (multilevelNamespace !== null) {
    const parentNS = namespace.substring(0, multilevelNamespace[0].length - 1);
    const childNS = namespace.substring(multilevelNamespace[0].length);
    const extend = {
      [parentNS]: recursivelyMergeState(get(initialState, parentNS), childNS, state),
    };

    return Object.freeze(assign({},
      initialState,
      extend,
    ));
  }

  return Object.freeze(assign({}, initialState, { [namespace]: state }));
};

/**
 * Store class
 */
class Store {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */
  constructor(methods = {}, callback = () => true, initialState = {}) {
    const self = this;
    this.callback = callback;
    this.state = Object.freeze(initialState);
    iv(!methods.callback, '"callback" is a reserved name and cannot be used as a method name.');
    iv(!methods.mixin, '"mixin" is a reserved name and cannot be used as a method name.');
    iv(!methods.dispatcherIds, '"dispatcherIds" is a reserved name and cannot be used as a method name.');
    iv(!methods.state, '"state" is a reserved name and cannot be used as a method name.');
    iv(!methods.frozenState, '"frozenState" is a reserved name and cannot be used as a method name.');
    assign(this, EventEmitter.prototype, methods);
    this.mixin = {
      componentDidMount: function componentDidMount() {
        let warn;

        try {
          warn = (console.warn || console.log).bind(console); // eslint-disable-line no-console
        } catch (e) {
          warn = () => false;
        }

        this.componentMounted = true;

        if (!this.storeDidChange) {
          warn('A component that uses a McFly Store mixin is not implementing storeDidChange. onChange will be called instead, but this will no longer be supported from version 1.0.');
        }
        const changeFn = this.storeDidChange || this.onChange;
        if (!changeFn) {
          warn('A change handler is missing from a component with a McFly mixin. Notifications from Stores are not being handled.');
        }
        this.listener = () => this.componentMounted && changeFn();
        self.addChangeListener(this.listener);
      },
      componentWillUnmount: function componentWillUnmount() {
        this.componentMounted = false;
        if (this.listener) {
          self.removeChangeListener(this.listener);
        }
      },
    };
  }

  /**
   * Returns dispatch token
   */
  getDispatchToken() {
    return this.dispatcherID;
  }

  /**
   * Emits change event
   */
  emitChange() {
    this.emit('change');
  }

  /**
   * Adds a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  addChangeListener(callback) {
    this.on('change', callback);
  }

  /**
   * Removes a change listener
   *
   * @param {function} callback - Callback method for change event
   */
  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }

  addMethods(methods) {
    assign(this, methods);
  }

  mergeState(namespace, state) {
    const prevState = get(this.state, namespace);
    if (prevState !== state) {
      const newState = Object.isFrozen(state) ? state : Object.freeze(state);
      this.state = recursivelyMergeState(this.state, namespace, newState);
    }
  }

  emitChangeIfStoreChanged(newState) {
    if (newState && newState !== this.state) {
      this.state = Object.freeze(newState);
      this.emitChange();
    }
    return this.state;
  }
}

class MasterStore extends Store {
  constructor(initialState = {}) {
    super({}, undefined, initialState);
    this.dispatcherIds = {};
    this.frozenState = null;
  }

  /**
   * Returns dispatch token
   */
  getDispatchTokens(namespace = '') {
    if (isString(namespace)) {
      return namespace === '' || !this.dispatcherIds.hasOwnProperty(namespace) ?
        map(this.dispatcherIds, dId => dId) :
        [this.dispatcherIds[namespace]];
    }
    if (!isArray(namespace)) {
      iv(false, `cannot get dispatcherTokens from a namespace of type ${typeof namespace}.`);
    }

    return compact(map(this.dispatcherIds, (dispacherID, ns) => (
      includes(namespace, ns) ? dispacherID : null))
    );
  }

  freezeState() {
    this.frozenState = this.state;
  }

  emitChangeIfStoreChanged() {
    if (this.frozenState !== this.state) {
      this.frozenState = null;
      this.emitChange();
    }
    return this.state;
  }

  /**
   * Adds a dispatcher id generated by the flux dispather and associates it with
   * a reducer namespace.  This will be used by appDispatcher.waitFor in case we want
   * to synchronously handle action callbacks.
   * @param {[type]} namespace    [description]
   * @param {[type]} dispatcherID [description]
   */
  addDispatcherId(namespace, dispatcherID) {
    if (namespace !== null && this.dispatcherIds.hasOwnProperty(namespace)) {
      iv(false, `namespace ${namespace} is already registered with the dispatcher.`);
    }
    this.dispatcherIds[namespace] = dispatcherID;
  }
}

export default Store;
export { MasterStore };
