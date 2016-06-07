import Dispatcher from './Dispatcher';
import message from './Messager';

function reThrow(reject, error) {
  if (error && error.stack) {
    console.error(error.stack); // eslint-disable-line no-console
  }
  return reject(error);
}


/**
 * Action class
 */
class Action {

  /**
   * Constructs an Action object
   *
   * @param {function} callback - Callback method for Action
   * @constructor
   */
  constructor(callback, actionName) {
    this.callback = callback;
    this.actionName = actionName;
  }


  /**
   * Calls callback method from Dispatcher
   *
   * @param {...*} arguments - arguments for callback method
   * @returns Promise object
   */
  dispatch(...args) {
    return Promise.resolve(this.callback.apply(this, args)).then((payload) =>
      new Promise((resolve, reject) => {
        if (!payload) return reThrow(reject, message('payloadObject'));
        if (!payload.actionType) {
          console.log(999, message('payloadRequiresActionType'));
          return reThrow(reject, message('payloadRequiresActionType'));
        }

        try {
          Dispatcher.dispatch(payload);
        } catch (error) {
          reThrow(reject, error);
        }

        resolve();
        return true;
      }));
  }

  syncDispatch() {
    const payload = this.callback.apply(this, arguments);
    const reject = () => true;
    if (!payload) return reThrow(reject, 'Payload needs to be an object');
    if (!payload.actionType) return reThrow(reject, 'Payload object requires an actionType property');

    try {
      Dispatcher.dispatch(payload);
    } catch (error) {
      reThrow(reject, error);
    }
  }
}

export default Action;
