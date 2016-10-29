import { flaxs } from 'flaxs';
import Actions from '../constants/ActionTypes';

export default flaxs.createActions({
    incrementCounterWithStore: (state) => ({
      actionType: Actions.INCREMENT_COUNTER_WITH_STORE,
      state: state,
    }),
    decrementCounterWithStore: (state) => ({
      actionType: Actions.DECREMENT_COUNTER_WITH_STORE,
      state,
    }),
    incrementCounterWithReducer: () => ({
      actionType: Actions.INCREMENT_COUNTER_WITH_REDUCER,
    }),
    decrementCounterWithReducer: () => ({
      actionType: Actions.DECREMENT_COUNTER_WITH_REDUCER,
    }),
});
