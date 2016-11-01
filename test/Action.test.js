/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Action from '../src/Action';
import Dispatcher from '../src/Dispatcher';

chai.use(spies);

describe('Action', () => {
  let mockAction;
  let callback;

  Dispatcher.dispatch = chai.spy(Dispatcher.dispatch);

  it('should attach the callback argument to the instance', () => {
    callback = () => false;
    mockAction = new Action(callback);
    expect(mockAction.callback).to.equal(callback);
  });

  it('should reject if actionType isn\'t supplied', async () => {
    callback = argument => ({ test: argument });

    mockAction = new Action(callback);
    let success = true;
    let error;

    try {
      success = await mockAction.dispatch('test');
    } catch (e) {
      error = e;
    }

    expect(success).to.be.true;
    expect(error).to.equal('Payload object requires an actionType property');
  });

  it('should not throw if actionType IS supplied', () => {
    callback = argument => ({
      actionType: 'TEST_ACTION',
      test: argument,
    });

    mockAction = new Action(callback);

    expect(() => {
      mockAction.dispatch('test');
    }).to.not.throw(/.*/);
  });

  it('should reject if returns falsy value', async () => {
    callback = () => false;
    mockAction = new Action(callback);
    let success = true;
    let error;

    try {
      success = await mockAction.dispatch('test');
    } catch (caughtError) {
      error = caughtError;
    }

    expect(success).to.be.true;
    expect(error).to.equal('Payload needs to be an object');
  });

  it('should resolve if actionType IS supplied', async () => {
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

    expect(success).to.be.undefined;
    expect(error).to.be.undefined;
  });

  it('should have dispatched the supplied payload', () => {
    expect(Dispatcher.dispatch).to.have.been.called.twice;
  });
});
