import ActionTypes from '../constants/ActionTypes';

export default (state, {actionType, ...params}) => {
  switch (actionType) {
    // For now we just change the location state in this store, but we might want to do something else when pushing poping replacing.
    case ActionTypes.REPLACE_ROUTE:
      return [
        ...state.slice(0, state.length - 1),
        params.location,
      ];
    case ActionTypes.POP_ROUTE:
      return [
        ...state.slice(0, state.length - 2),
        params.location,
      ];
    case ActionTypes.PUSH_ROUTE:
    case ActionTypes.LOAD_ROUTES:
      return [
        ...state,
        params.location,
      ]
  }
  return state;
};

const namespace = 'routes';
const initialState = [];

export {
  namespace,
  initialState,
};
