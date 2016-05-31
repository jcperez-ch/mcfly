'use strict';

import Action from './Action';
import { forEach } from 'lodash';

/**
 * ActionsFactory class
 */
export default class ActionsFactory {

  /**
   * Constructs an ActionsFactory object and translates actions parameter into
   * Action objects.
   *
   * @param {object} actions - Object with methods to create actions with
   * @constructor
   */
  constructor(actions) {
    forEach(actions, (actionCallback, actionName) => {
      const action = new Action(actionCallback);
      this[actionName] = action.dispatch.bind(action);
    });
  }
}
