import Action from './Action';

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
  constructor(actions, isAsync = true) {
    Object.keys(actions).forEach((actionName) => {
      const actionCallback = actions[actionName];
      const action = new Action(actionCallback, actionName);

      this[actionName] = isAsync ? action.dispatch.bind(action) : action.syncDispatch.bind(action);
    });
  }
}
