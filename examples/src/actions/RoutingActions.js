import { flaxs } from '../../../';
import ActionTypes from '../constants/ActionTypes';

export default flaxs.createActions({
  loadRoutes: (location) => ({
    actionType: ActionTypes.LOAD_ROUTES,
    location,
  }),
  pushRoute: (location) => ({
    actionType: ActionTypes.PUSH_ROUTE,
    location,
  }),
  popRoute: (location) => ({
    actionType: ActionTypes.POP_ROUTE,
    location,
  }),
  replaceRoute: (location) => ({
    actionType: ActionTypes.REPLACE_ROUTE,
    location,
  }),
});
