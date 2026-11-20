import '../../setup'; // in-memory MongoDB for this file
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Subscriber, { type ISubscriber } from '../../../models/subscriber';
import {
  subscriberService,
  type NewSubscriber,
  type SubscriberUpdate
} from '../../../services/subscribers';

const addSubscriber = (fields: Partial<ISubscriber> = {}) =>
  Subscriber.create({ name: 'Ada Lovelace', subscribedToChannel: 'Tech Talks', ...fields });

describe('subscriber service', () => {
  describe('createSubscriber', () => {
    it('saves the name and channel and sets the subscribe date', async () => {
      const subscriber = await subscriberService.createSubscriber({
        name: 'Ada Lovelace',
        subscribedToChannel: 'Tech Talks'
      });

      assert.equal(subscriber.name, 'Ada Lovelace');
      assert.equal(subscriber.subscribedToChannel, 'Tech Talks');
      assert.ok(subscriber.subscribeDate instanceof Date);
      assert.equal(await Subscriber.countDocuments(), 1);
    });

    it('does not let the caller set the subscribe date', async () => {
      const payload = {
        name: 'Ada Lovelace',
        subscribedToChannel: 'Tech Talks',
        subscribeDate: new Date('2000-01-01')
      };

      const subscriber = await subscriberService.createSubscriber(payload);

      assert.notEqual(subscriber.subscribeDate.getFullYear(), 2000);
    });

    it('rejects a subscriber missing required fields', async () => {
      // The type forbids this, so cast to simulate bad input reaching the service
      const payload = { name: 'Ada Lovelace' } as NewSubscriber;

      await assert.rejects(
        subscriberService.createSubscriber(payload),
        mongoose.Error.ValidationError
      );
      assert.equal(await Subscriber.countDocuments(), 0);
    });
  });

  describe('getAllSubscribers', () => {
    it('returns every subscriber', async () => {
      await addSubscriber({ name: 'Ada' });
      await addSubscriber({ name: 'Grace' });

      const subscribers = await subscriberService.getAllSubscribers();

      assert.deepEqual(subscribers.map((s) => s.name).sort(), ['Ada', 'Grace']);
    });

    it('returns an empty list when there are no subscribers', async () => {
      assert.deepEqual(await subscriberService.getAllSubscribers(), []);
    });
  });

  describe('getSubscriberById', () => {
    it('returns the matching subscriber', async () => {
      const existing = await addSubscriber();

      const found = await subscriberService.getSubscriberById(existing.id);

      assert.equal(found?.name, 'Ada Lovelace');
    });

    it('returns null when no subscriber has that id', async () => {
      const unusedId = new mongoose.Types.ObjectId().toString();

      assert.equal(await subscriberService.getSubscriberById(unusedId), null);
    });

    it('rejects an id that is not a valid ObjectId', async () => {
      await assert.rejects(subscriberService.getSubscriberById('abc'), mongoose.Error.CastError);
    });
  });

  describe('updateSubscriber', () => {
    it('changes only the fields that are provided', async () => {
      const existing = await addSubscriber();

      await subscriberService.updateSubscriber(existing, { name: 'Grace Hopper' });

      const saved = await Subscriber.findById(existing.id);
      assert.equal(saved?.name, 'Grace Hopper');
      assert.equal(saved?.subscribedToChannel, 'Tech Talks');
    });

    it('updates both fields when both are provided', async () => {
      const existing = await addSubscriber();

      await subscriberService.updateSubscriber(existing, {
        name: 'Grace Hopper',
        subscribedToChannel: 'Compilers'
      });

      const saved = await Subscriber.findById(existing.id);
      assert.equal(saved?.name, 'Grace Hopper');
      assert.equal(saved?.subscribedToChannel, 'Compilers');
    });

    it('ignores fields sent as null', async () => {
      const existing = await addSubscriber();

      await subscriberService.updateSubscriber(existing, { name: null, subscribedToChannel: null });

      const saved = await Subscriber.findById(existing.id);
      assert.equal(saved?.name, 'Ada Lovelace');
      assert.equal(saved?.subscribedToChannel, 'Tech Talks');
    });

    it('does not change the subscribe date', async () => {
      const existing = await addSubscriber();
      const originalDate = existing.subscribeDate.getTime();
      // The type forbids this, so cast to simulate bad input reaching the service
      const payload = { subscribeDate: new Date('2000-01-01') } as unknown as SubscriberUpdate;

      await subscriberService.updateSubscriber(existing, payload);

      const saved = await Subscriber.findById(existing.id);
      assert.equal(saved?.subscribeDate.getTime(), originalDate);
    });
  });

  describe('deleteSubscriber', () => {
    it('removes the subscriber from the database', async () => {
      const existing = await addSubscriber();

      await subscriberService.deleteSubscriber(existing);

      assert.equal(await Subscriber.findById(existing.id), null);
    });
  });
});
