import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { ObjectSchema } from 'joi';
import { createSubscriberSchema, updateSubscriberSchema } from '../../../validators/subscribers';

// Lists each problem as "field: Joi error type", or [] when the payload is valid
const problems = (schema: ObjectSchema, payload: unknown) => {
  const { error } = schema.validate(payload, { abortEarly: false });
  return error ? error.details.map((d) => `${d.path.join('.')}: ${d.type}`) : [];
};

describe('createSubscriberSchema', () => {
  it('accepts a name and a channel', () => {
    assert.deepEqual(problems(createSubscriberSchema, { name: 'Ada', subscribedToChannel: 'Tech' }), []);
  });

  it('requires both name and subscribedToChannel', () => {
    assert.deepEqual(problems(createSubscriberSchema, {}), [
      'name: any.required',
      'subscribedToChannel: any.required'
    ]);
  });

  it('rejects empty strings', () => {
    assert.deepEqual(problems(createSubscriberSchema, { name: '', subscribedToChannel: 'Tech' }), [
      'name: string.empty'
    ]);
  });

  it('rejects values that are not strings', () => {
    assert.deepEqual(problems(createSubscriberSchema, { name: 'Ada', subscribedToChannel: 42 }), [
      'subscribedToChannel: string.base'
    ]);
  });
});

describe('updateSubscriberSchema', () => {
  it('accepts an empty object', () => {
    assert.deepEqual(problems(updateSubscriberSchema, {}), []);
  });

  it('accepts either field on its own', () => {
    assert.deepEqual(problems(updateSubscriberSchema, { name: 'Grace' }), []);
    assert.deepEqual(problems(updateSubscriberSchema, { subscribedToChannel: 'Compilers' }), []);
  });

  it('rejects empty strings', () => {
    assert.deepEqual(problems(updateSubscriberSchema, { subscribedToChannel: '' }), [
      'subscribedToChannel: string.empty'
    ]);
  });

  it('rejects values that are not strings', () => {
    assert.deepEqual(problems(updateSubscriberSchema, { name: 7 }), ['name: string.base']);
  });
});
