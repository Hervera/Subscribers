const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../app');
require('../../setup'); // in-memory MongoDB for this file
const Subscriber = require('../../../models/subscriber');

const addSubscriber = (fields = {}) =>
  Subscriber.create({ name: 'Ada Lovelace', subscribedToChannel: 'Tech Talks', ...fields });

const unusedId = () => new mongoose.Types.ObjectId().toString();

describe('GET /subscribers', () => {
  it('returns all subscribers', async () => {
    await addSubscriber({ name: 'Ada' });
    await addSubscriber({ name: 'Grace' });

    const res = await request(app).get('/subscribers');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((s) => s.name).sort(), ['Ada', 'Grace']);
  });

  it('returns an empty array when there are no subscribers', async () => {
    const res = await request(app).get('/subscribers');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });
});

describe('POST /subscribers', () => {
  it('creates a subscriber and returns it with 201', async () => {
    const res = await request(app)
      .post('/subscribers')
      .send({ name: 'Ada Lovelace', subscribedToChannel: 'Tech Talks' });

    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'Ada Lovelace');
    assert.equal(res.body.subscribedToChannel, 'Tech Talks');
    assert.ok(res.body._id);
    assert.ok(res.body.subscribeDate);
    assert.equal(await Subscriber.countDocuments(), 1);
  });

  it('rejects a request missing required fields with 400 and saves nothing', async () => {
    const res = await request(app).post('/subscribers').send({});

    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name is required. subscribedToChannel is required');
    assert.equal(await Subscriber.countDocuments(), 0);
  });

  it('rejects a request with no body', async () => {
    const res = await request(app).post('/subscribers');

    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name is required. subscribedToChannel is required');
  });

  it('rejects an empty name', async () => {
    const res = await request(app)
      .post('/subscribers')
      .send({ name: '', subscribedToChannel: 'Tech Talks' });

    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name is not allowed to be empty');
  });

  it('rejects a name that is not a string', async () => {
    const res = await request(app)
      .post('/subscribers')
      .send({ name: 5, subscribedToChannel: 'Tech Talks' });

    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'name must be a string');
  });

  it('ignores fields that are not part of a subscriber', async () => {
    const res = await request(app)
      .post('/subscribers')
      .send({ name: 'Ada Lovelace', subscribedToChannel: 'Tech Talks', role: 'admin' });

    assert.equal(res.status, 201);
    assert.equal(res.body.role, undefined);
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/subscribers')
      .set('Content-Type', 'application/json')
      .send('{"name": ');

    assert.equal(res.status, 400);
    assert.equal(typeof res.body.message, 'string');
  });
});

describe('GET /subscribers/:id', () => {
  it('returns the subscriber', async () => {
    const existing = await addSubscriber();

    const res = await request(app).get(`/subscribers/${existing.id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body._id, existing.id);
    assert.equal(res.body.name, 'Ada Lovelace');
  });

  it('returns 404 when the subscriber does not exist', async () => {
    const res = await request(app).get(`/subscribers/${unusedId()}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.message, 'Cannot find subscriber');
  });

  it('returns 500 for an id that is not a valid ObjectId', async () => {
    const res = await request(app).get('/subscribers/abc');

    assert.equal(res.status, 500);
    assert.match(res.body.message, /Cast to ObjectId failed/);
  });
});

describe('PATCH /subscribers/:id', () => {
  it('updates only the fields that are sent', async () => {
    const existing = await addSubscriber();

    const res = await request(app)
      .patch(`/subscribers/${existing.id}`)
      .send({ name: 'Grace Hopper' });

    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Grace Hopper');
    assert.equal(res.body.subscribedToChannel, 'Tech Talks');

    const saved = await Subscriber.findById(existing.id);
    assert.equal(saved.name, 'Grace Hopper');
  });

  it('leaves the subscriber unchanged when the body is empty', async () => {
    const existing = await addSubscriber();

    const res = await request(app).patch(`/subscribers/${existing.id}`).send({});

    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Ada Lovelace');
    assert.equal(res.body.subscribedToChannel, 'Tech Talks');
  });

  it('rejects an invalid value with 400 and keeps the saved subscriber', async () => {
    const existing = await addSubscriber();

    const res = await request(app)
      .patch(`/subscribers/${existing.id}`)
      .send({ subscribedToChannel: '' });

    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'subscribedToChannel is not allowed to be empty');

    const saved = await Subscriber.findById(existing.id);
    assert.equal(saved.subscribedToChannel, 'Tech Talks');
  });

  it('returns 404 when the subscriber does not exist', async () => {
    const res = await request(app)
      .patch(`/subscribers/${unusedId()}`)
      .send({ name: 'Grace Hopper' });

    assert.equal(res.status, 404);
  });
});

describe('DELETE /subscribers/:id', () => {
  it('deletes the subscriber', async () => {
    const existing = await addSubscriber();

    const res = await request(app).delete(`/subscribers/${existing.id}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Deleted Subscriber');
    assert.equal(await Subscriber.findById(existing.id), null);
  });

  it('returns 404 when the subscriber does not exist', async () => {
    const res = await request(app).delete(`/subscribers/${unusedId()}`);

    assert.equal(res.status, 404);
  });
});
