const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const Joi = require('joi');
const { validate } = require('../../../middlewares/validate');
const { mockResponse, firstCallArgs } = require('../helpers');

// A small schema of its own, so these tests don't depend on the subscriber rules
const bookSchema = Joi.object({
  title: Joi.string().required(),
  pages: Joi.number()
});

const run = (body, schema = bookSchema) => {
  const req = { body };
  const res = mockResponse();
  const next = mock.fn();
  validate(schema)(req, res, next);
  return { req, res, next };
};

describe('validate', () => {
  it('calls next when the body is valid', () => {
    const { res, next } = run({ title: 'Dune', pages: 412 });

    assert.equal(next.mock.callCount(), 1);
    assert.equal(res.status.mock.callCount(), 0);
  });

  it('replaces req.body with the validated value, dropping unknown fields', () => {
    const { req } = run({ title: 'Dune', author: 'Frank Herbert' });

    assert.deepEqual(req.body, { title: 'Dune' });
  });

  it('responds 400 listing every problem and does not call next', () => {
    const { res, next } = run({ title: '', pages: 'many' });

    assert.deepEqual(firstCallArgs(res.status), [400]);
    assert.deepEqual(firstCallArgs(res.json), [
      { message: 'title is not allowed to be empty. pages must be a number' }
    ]);
    assert.equal(next.mock.callCount(), 0);
  });

  it('treats a missing body as an empty object', () => {
    const { res } = run(undefined);

    assert.deepEqual(firstCallArgs(res.json), [{ message: 'title is required' }]);
  });

  it('lets a missing body through as {} when nothing is required', () => {
    const { req, next } = run(undefined, Joi.object({ pages: Joi.number() }));

    assert.deepEqual(req.body, {});
    assert.equal(next.mock.callCount(), 1);
  });
});
