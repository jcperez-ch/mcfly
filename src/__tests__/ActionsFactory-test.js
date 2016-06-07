// __tests__/ActionsFactory-test.js
/* eslint-disable global-require */

jest.dontMock('../ActionsFactory');
jest.dontMock('../Action');

describe('ActionsFactory', () => {

  const ActionsFactory = require('../ActionsFactory').default;
  let mockActionsFactory;

  it('create new Actions and return an object with the supplied method names as callers', () => {
    mockActionsFactory = new ActionsFactory({
      testMethodA: () => ({
        actionType: 'TEST_ACTION_A',
        data: arguments,
      }),
      testMethodB: () => ({
        actionType: 'TEST_ACTION_B',
        data: arguments,
      }),
    });

    expect(mockActionsFactory.testMethodA).toBeDefined();
    expect(mockActionsFactory.testMethodB).toBeDefined();
  });

});
