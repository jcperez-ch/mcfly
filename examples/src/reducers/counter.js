import Actions from "i../constants/ActionTypes";

export default (state, action) => {
  switch(action.actionType) {
    case Actions.INCREMENT_COUNTER_WITH_REDUCER:
      return state + 1;
    case Actions.DECREMENT_COUNTER_WITH_REDUCER:
      return state - 1;
    default:
      return state;
  }
}

const namespace = 'counter';
const initialState = 0;

export {
  namespace,
  initialState,
}
