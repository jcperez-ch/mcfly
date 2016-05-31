'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MasterStore = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Store class
 */

var Store = function () {

  /**
   * Constructs a Store object, extends it with EventEmitter and supplied
   * methods parameter,  and creates a mixin property for use in components.
   *
   * @param {object} methods - Public methods for Store instance
   * @param {function} callback - Callback method for Dispatcher dispatches
   * @constructor
   */

  function Store(methods, callback) {
    _classCallCheck(this, Store);

    var self = this;
    this.callback = callback;
    (0, _invariant2.default)(!methods.callback, '"callback" is a reserved name and cannot be used as a method name.');
    (0, _invariant2.default)(!methods.mixin, '"mixin" is a reserved name and cannot be used as a method name.');
    (0, _lodash.assign)(this, _events.EventEmitter.prototype, methods);
    this.mixin = {
      componentDidMount: function componentDidMount() {
        var _this = this;

        var warn = void 0;
        var changeFn = void 0;

        try {
          warn = (console.warn || console.log).bind(console);
        } catch (e) {
          warn = function warn() {
            return false;
          };
        }

        if (!this.storeDidChange) {
          warn("A component that uses a McFly Store mixin is not implementing storeDidChange. onChange will be called instead, but this will no longer be supported from version 1.0.");
        }
        changeFn = this.storeDidChange || this.onChange;
        if (!changeFn) {
          warn("A change handler is missing from a component with a McFly mixin. Notifications from Stores are not being handled.");
        }
        this.listener = function () {
          _this.isMounted() && changeFn();
        };
        self.addChangeListener(this.listener);
      },
      componentWillUnmount: function componentWillUnmount() {
        this.listener && self.removeChangeListener(this.listener);
      }
    };
  }

  /**
   * Returns dispatch token
   */


  _createClass(Store, [{
    key: 'getDispatchToken',
    value: function getDispatchToken() {
      return this.dispatcherID;
    }

    /**
     * Emits change event
     */

  }, {
    key: 'emitChange',
    value: function emitChange() {
      this.emit('change');
    }

    /**
     * Adds a change listener
     *
     * @param {function} callback - Callback method for change event
     */

  }, {
    key: 'addChangeListener',
    value: function addChangeListener(callback) {
      this.on('change', callback);
    }

    /**
     * Removes a change listener
     *
     * @param {function} callback - Callback method for change event
     */

  }, {
    key: 'removeChangeListener',
    value: function removeChangeListener(callback) {
      this.removeListener('change', callback);
    }
  }]);

  return Store;
}();

var MasterStore = function (_Store) {
  _inherits(MasterStore, _Store);

  function MasterStore() {
    var methods = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {
      return true;
    } : arguments[1];
    var initialState = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, MasterStore);

    (0, _invariant2.default)(!methods.dispatcherIds, '"dispatcherIds" is a reserved name and cannot be used as a method name.');
    (0, _invariant2.default)(!methods.state, '"state" is a reserved name and cannot be used as a method name.');

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(MasterStore).call(this, methods, callback));

    _this2.state = initialState;
    _this2.dispatcherIds = {};
    return _this2;
  }

  _createClass(MasterStore, [{
    key: 'mergeState',
    value: function mergeState(state) {
      this.state = Object.freeze((0, _lodash.assign)({}, this.state, state));
    }
  }, {
    key: 'addMethods',
    value: function addMethods(methods) {
      (0, _lodash.assign)(this, methods);
    }

    /**
     * Returns dispatch token
     */

  }, {
    key: 'getDispatchToken',
    value: function getDispatchToken() {
      var namespace = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if ((0, _lodash.isString)(namespace)) {
        return !this.dispatcherIds.hasOwnProperty(namespace) ? (0, _lodash.map)(this.dispatcherIds, function (dId) {
          return dId;
        }) : [this.dispatcherIds[namespace]];
      }
      if (!(0, _lodash.isArray)(namespace)) {
        (0, _invariant2.default)(false, 'cannot get dispatcherTokens from a namespace of type ' + (typeof namespace === 'undefined' ? 'undefined' : _typeof(namespace)) + '.');
      }

      return (0, _lodash.compact)((0, _lodash.map)(this.dispatcherIds, function (dispacherID, ns) {
        return (0, _lodash.includes)(namespace, ns) ? dispacherID : null;
      }));
    }

    /**
     * Adds a dispatcher id generated by the flux dispather and associates it with
     * a reducer namespace.  This will be used by appDispatcher.waitFor in case we want
     * to synchronously handle action callbacks.
     * @param {[type]} namespace    [description]
     * @param {[type]} dispatcherID [description]
     */

  }, {
    key: 'addDispatcherId',
    value: function addDispatcherId(namespace, dispatcherID) {
      if (namespace !== null && this.dispatcherIds.hasOwnProperty(namespace)) {
        (0, _invariant2.default)(false, 'namespace ' + namespace + ' is already registered with the dispatcher.');
      }
      this.dispatcherIds[namespace] = dispatcherID;
    }
  }]);

  return MasterStore;
}(Store);

exports.default = Store;
exports.MasterStore = MasterStore;