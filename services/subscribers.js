const Subscriber = require('../models/subscriber');

const getAllSubscribers = () => Subscriber.find();

const getSubscriberById = (id) => Subscriber.findById(id);

const createSubscriber = ({ name, subscribedToChannel }) => {
  const subscriber = new Subscriber({ name, subscribedToChannel });
  return subscriber.save();
};

// Applies only the fields that were provided, then saves
const updateSubscriber = (subscriber, { name, subscribedToChannel }) => {
  if (name != null) {
    subscriber.name = name;
  }
  if (subscribedToChannel != null) {
    subscriber.subscribedToChannel = subscribedToChannel;
  }
  return subscriber.save();
};

const deleteSubscriber = (subscriber) => subscriber.deleteOne();

module.exports = {
  getAllSubscribers,
  getSubscriberById,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
};
