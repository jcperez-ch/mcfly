import { createStore } from '../../';
import routesReducer, * as routes from './reducers/routes';
import routingReducer, * as routing from './reducers/routing';

const flaxs = createStore();

flaxs.createReducer(routing.namespace, routingReducer, routing.initialState);
flaxs.createReducer(routes.namespace, routesReducer, routes.initialState);
