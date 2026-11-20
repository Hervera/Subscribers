import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import errorHandler from '../../../middlewares/errorHandler';
import { mockResponse, asRequest, asResponse, firstCallArgs } from '../helpers';

const makeError = (message: string, props: object = {}) => Object.assign(new Error(message), props);

const run = (err: Error, res = mockResponse(), next = mock.fn()) => {
  errorHandler(err, asRequest({}), asResponse(res), next);
  return { res, next };
};

describe('errorHandler', () => {
  it('responds 400 for a Mongoose validation error', () => {
    const { res } = run(makeError('name is required', { name: 'ValidationError' }));

    assert.deepEqual(firstCallArgs(res.status), [400]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'name is required' }]);
  });

  it('uses the status set on the error', () => {
    const { res } = run(makeError('Bad JSON', { status: 400 }));

    assert.deepEqual(firstCallArgs(res.status), [400]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'Bad JSON' }]);
  });

  it('responds 500 for any other error', () => {
    const { res } = run(makeError('Database is down'));

    assert.deepEqual(firstCallArgs(res.status), [500]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'Database is down' }]);
  });

  it('hands the error to Express when the response has already started', () => {
    const res = mockResponse();
    res.headersSent = true;
    const err = makeError('Too late');

    const { next } = run(err, res);

    assert.deepEqual(firstCallArgs(next), [err]);
    assert.equal(res.status.mock.callCount(), 0);
  });
});
