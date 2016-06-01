'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flaxs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createStore = createStore;

var _Dispatcher = require('./Dispatcher');

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _ActionsFactory = require('./ActionsFactory');

var _ActionsFactory2 = _interopRequireDefault(_ActionsFactory);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Main McFly Class
 */

var Flaxs = function () {

  /**
   * Instatiates McFly along with actions object, stores array and sets
   * dispatcher to Dispatcher.
   *
   * @constructor
   */

  function Flaxs() {
    var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Flaxs);

    this.actions = {};
    this.stores = [];
    this.reducers = {};
    this.dispatcher = _Dispatcher2.default;
    this.store = new _Store.MasterStore(initialState);
  }

  /**
   * Creates an instance of a Store, registers the supplied callback with the
   * dispatcher, and pushes it into the global list of stores
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @return {object} - Returns instance of Store
   */


  _createClass(Flaxs, [{
    key: 'createStore',
    value: function createStore(methods, callback) {
      var initialState = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var store = new _Store2.default(methods, callback, initialState);
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

  }, {
    key: 'createActions',
    value: function createActions(actions) {
      var actionFactory = new _ActionsFactory2.default(actions);
      (0, _lodash.assign)(this.actions, actionFactory);
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

  }, {
    key: 'createReducer',
    value: function createReducer(namespace, reducer) {
      var _this = this;

      var initialState = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this.store.mergeState(namespace, initialState);
      this.store.addDispatcherId(namespace, this.dispatcher.register(function (payload) {
        var state = Object.freeze(reducer(_this.store.state[namespace], payload));
        if (state !== _this.store.state[namespace]) {
          _this.store.mergeState(namespace, state);
          _this.store.emitChange();
        }
        return true;
      }));
      this.reducers[namespace] = reducer;
      return this;
    }
  }]);

  return Flaxs;
}();

var flaxs = new Flaxs();
exports.default = Flaxs;
function createStore() {
  var initialState = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  exports.flaxs = flaxs = new Flaxs(initialState);
  return flaxs;
}

exports.flaxs = flaxs;