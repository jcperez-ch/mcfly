'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Action = require('./Action');

var _Action2 = _interopRequireDefault(_Action);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ActionsFactory class
 */

var ActionsFactory =

/**
 * Constructs an ActionsFactory object and translates actions parameter into
 * Action objects.
 *
 * @param {object} actions - Object with methods to create actions with
 * @constructor
 */
function ActionsFactory(actions) {
  var _this = this;

  _classCallCheck(this, ActionsFactory);

  (0, _lodash.forEach)(actions, function (actionCallback, actionName) {
    var action = new _Action2.default(actionCallback);
    _this[actionName] = action.dispatch.bind(action);
  });
};

exports.default = ActionsFactory;