import ActionTypes from '../constants/ActionTypes';
import { reduce } from 'lodash';

export default (state, {actionType, ...params}) => {
  switch (actionType) {
    // For now we just change the location state in this store, but we might want to do something else when pushing poping replacing.
    case ActionTypes.REPLACE_ROUTE:
    case ActionTypes.POP_ROUTE:
    case ActionTypes.PUSH_ROUTE:
    case ActionTypes.LOAD_ROUTES:
      return reduce(params.location, (accState, prop, key) => {
        if (key === 'key') {
          accState['hashKey'] = prop;
        } else {
          accState[key] = prop;
        }
        return accState;
      }, {});
    default:

  }
  return state;
};

const namespace = 'routing';
const initialState = {
  pendingHistory: true,
};
export {
  namespace,
  initialState,
}
