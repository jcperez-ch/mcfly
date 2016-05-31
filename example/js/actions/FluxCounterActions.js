var mcFly = require('../flux/mcFly');

var FluxCounterActions = mcFly.createActions({
  countOne: () => ({
    actionType: 'COUNT_ONE'
  }),
});

module.exports = FluxCounterActions;
