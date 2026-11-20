const subscriberService = require('../services/subscribers');

// Errors thrown in these async handlers go to the global error handler (Express 5)

// Get all subscribers
const getAllSubscribers = async (req, res) => {
  const subscribers = await subscriberService.getAllSubscribers();
  res.json(subscribers);
};

// Create a new subscriber
const createSubscriber = async (req, res) => {
  const newSubscriber = await subscriberService.createSubscriber(req.body);
  res.status(201).json(newSubscriber);
};

// Get a single subscriber
const getSubscriberById = (req, res) => {
  res.json(res.subscriber);
};

// Update a subscriber
const updateSubscriber = async (req, res) => {
  const updatedSubscriber = await subscriberService.updateSubscriber(res.subscriber, req.body);
  res.json(updatedSubscriber);
};

// Delete a subscriber
const deleteSubscriber = async (req, res) => {
  await subscriberService.deleteSubscriber(res.subscriber);
  res.json({ message: 'Deleted Subscriber' });
};

module.exports = {
  getAllSubscribers,
  createSubscriber,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber
};
