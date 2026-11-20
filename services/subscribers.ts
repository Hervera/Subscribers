import Subscriber, { type SubscriberDocument } from '../models/subscriber';

export interface NewSubscriber {
  name: string;
  subscribedToChannel: string;
}

// Fields that are left out (or null) are not changed
export interface SubscriberUpdate {
  name?: string | null;
  subscribedToChannel?: string | null;
}

const getAllSubscribers = () => Subscriber.find();

const getSubscriberById = (id: string) => Subscriber.findById(id);

const createSubscriber = ({ name, subscribedToChannel }: NewSubscriber) => {
  const subscriber = new Subscriber({ name, subscribedToChannel });
  return subscriber.save();
};

// Applies only the fields that were provided, then saves
const updateSubscriber = (
  subscriber: SubscriberDocument,
  { name, subscribedToChannel }: SubscriberUpdate
) => {
  if (name != null) {
    subscriber.name = name;
  }
  if (subscribedToChannel != null) {
    subscriber.subscribedToChannel = subscribedToChannel;
  }
  return subscriber.save();
};

const deleteSubscriber = (subscriber: SubscriberDocument) => subscriber.deleteOne();

// Exported as one object so tests can replace a single function with a fake
export const subscriberService = {
  getAllSubscribers,
  getSubscriberById,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
};
