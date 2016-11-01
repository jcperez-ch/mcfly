/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import ActionsFactory from '../src/ActionsFactory';

describe('ActionsFactory', () => {
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

    expect(mockActionsFactory.testMethodA).to.not.be.undefined;
    expect(mockActionsFactory.testMethodB).to.not.be.undefined;
  });

  it('create new synchronous Actions', () => {
    mockActionsFactory = new ActionsFactory({
      testMethodA: () => ({
        actionType: 'TEST_ACTION_A',
        data: arguments,
      }),
      testMethodB: () => ({
        actionType: 'TEST_ACTION_B',
        data: arguments,
      }),
    }, false);

    expect(mockActionsFactory.testMethodA).to.not.be.undefined;
    expect(mockActionsFactory.testMethodB).to.not.be.undefined;
  });
});
