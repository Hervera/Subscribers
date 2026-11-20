const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const errorHandler = require('../../../middlewares/errorHandler');
const { mockResponse, firstCallArgs } = require('../helpers');

const makeError = (message, props = {}) => Object.assign(new Error(message), props);

describe('errorHandler', () => {
  it('responds 400 for a Mongoose validation error', () => {
    const res = mockResponse();

    errorHandler(makeError('name is required', { name: 'ValidationError' }), {}, res, mock.fn());

    assert.deepEqual(firstCallArgs(res.status), [400]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'name is required' }]);
  });

  it('uses the status set on the error', () => {
    const res = mockResponse();

    errorHandler(makeError('Bad JSON', { status: 400 }), {}, res, mock.fn());

    assert.deepEqual(firstCallArgs(res.status), [400]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'Bad JSON' }]);
  });

  it('responds 500 for any other error', () => {
    const res = mockResponse();

    errorHandler(makeError('Database is down'), {}, res, mock.fn());

    assert.deepEqual(firstCallArgs(res.status), [500]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'Database is down' }]);
  });

  it('hands the error to Express when the response has already started', () => {
    const res = mockResponse();
    res.headersSent = true;
    const next = mock.fn();
    const err = makeError('Too late');

    errorHandler(err, {}, res, next);

    assert.deepEqual(firstCallArgs(next), [err]);
    assert.equal(res.status.mock.callCount(), 0);
  });
});
