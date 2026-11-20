import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { subscriberService } from '../../../services/subscribers';
import { getSubscriber } from '../../../middlewares/getSubscriber';
import { mockResponse, asRequest, asResponse, firstCallArgs } from '../helpers';

// Replaces the service's database lookup with a fake for one test
const fakeLookup = (implementation: (id: string) => Promise<unknown>) =>
  mock.method(subscriberService, 'getSubscriberById', implementation);

afterEach(() => mock.restoreAll());

const run = async () => {
  const req = asRequest<{ id: string }>({ params: { id: 'abc123' } });
  const res = mockResponse();
  const next = mock.fn();
  await getSubscriber(req, asResponse(res), next);
  return { res, next };
};

describe('getSubscriber', () => {
  it('looks up the subscriber by the id in the URL', async () => {
    const lookup = fakeLookup(async () => ({ name: 'Ada' }));

    await run();

    assert.deepEqual(firstCallArgs(lookup), ['abc123']);
  });

  it('stores the subscriber on res.subscriber and calls next', async () => {
    const subscriber = { name: 'Ada' };
    fakeLookup(async () => subscriber);

    const { res, next } = await run();

    assert.equal(res.subscriber, subscriber);
    assert.equal(next.mock.callCount(), 1);
    assert.equal(res.status.mock.callCount(), 0);
  });

  it('responds 404 when no subscriber has that id', async () => {
    fakeLookup(async () => null);

    const { res, next } = await run();

    assert.deepEqual(firstCallArgs(res.status), [404]);
    assert.deepEqual(firstCallArgs(res.json), [{ message: 'Cannot find subscriber' }]);
    assert.equal(next.mock.callCount(), 0);
    assert.equal(res.subscriber, undefined);
  });

  it('lets lookup errors reach the error handler', async () => {
    const dbError = new Error('Database is down');
    fakeLookup(async () => {
      throw dbError;
    });

    await assert.rejects(run(), (err) => err === dbError);
  });
});
