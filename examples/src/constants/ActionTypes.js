import { assign, reduce } from 'lodash';

const mirror = array => reduce(array, (accumulator, value) => assign(accumulator, { [value]: value }), {});

export default mirror([
  'LOAD_ROUTES',
  'PUSH_ROUTE',
  'POP_ROUTE',
  'REPLACE_ROUTE',
  'INCREMENT_COUNTER_WITH_STORE',
  'INCREMENT_COUNTER_WITH_REDUCER',
  'DECREMENT_COUNTER_WITH_STORE',
  'DECREMENT_COUNTER_WITH_REDUCER',
]);
