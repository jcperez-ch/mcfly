// __tests__/Action-test.js
/* eslint-disable global-require */

describe('Action', () => {
  const Action = require('../Action').default;
  const Dispatcher = require('../Dispatcher').default;
  let mockAction;
  let callback;

  it('should attach the callback argument to the instance', () => {
    callback = () => false;
    mockAction = new Action(callback);
    expect(mockAction.callback).toBe(callback);
  });

  pit('should reject if actionType isn\'t supplied', async () => {
    callback = argument => ({ test: argument });

    mockAction = new Action(callback);
    let success = true;
    let error;

    try {
      success = await mockAction.dispatch('test');
    } catch (e) {
      error = e;
    }

    expect(success).toBe(true);
    expect(error).toEqual('Payload object requires an actionType property');
  });

  it('should not throw if actionType IS supplied', () => {
    callback = argument => ({
      actionType: 'TEST_ACTION',
      test: argument,
    });

    mockAction = new Action(callback);

    expect(() => {
      mockAction.dispatch('test');
      jest.runAllTimers();
    }).not.toThrow();
  });

  pit('should reject if returns falsy value', async () => {
    callback = () => false;
    mockAction = new Action(callback);
    let success = true;
    let error;

    try {
      success = await mockAction.dispatch('test');
    } catch (caughtError) {
      error = caughtError;
    }

    expect(success).toBe(true);
    expect(error).toEqual('Payload needs to be an object');
  });

  pit('should resolve if actionType IS supplied', async () => {
    callback = argument => ({
      actionType: 'TEST_ACTION',
      test: argument,
    });
    mockAction = new Action(callback);
    let success = true;
    let error;

    try {
      success = await mockAction.dispatch('test');
    } catch (caughtError) {
      error = caughtError;
    }

    expect(success).toBeUndefined();
    expect(error).toBeUndefined();
  });

  it('should have dispatched the supplied payload', () => {
    expect(Dispatcher.dispatch.mock.calls.length).toEqual(2);
  });
});
