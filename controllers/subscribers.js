const subscriberService = require('../services/subscribers');

// Get all subscribers
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await subscriberService.getAllSubscribers();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new subscriber
const createSubscriber = async (req, res) => {
  try {
    const newSubscriber = await subscriberService.createSubscriber(req.body);
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single subscriber
const getSubscriberById = (req, res) => {
  res.json(res.subscriber);
};

// Update a subscriber
const updateSubscriber = async (req, res) => {
  try {
    const updatedSubscriber = await subscriberService.updateSubscriber(res.subscriber, req.body);
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a subscriber
const deleteSubscriber = async (req, res) => {
  try {
    await subscriberService.deleteSubscriber(res.subscriber);
    res.json({ message: 'Deleted Subscriber' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware to load a subscriber by ID into res.subscriber
const getSubscriber = async (req, res, next) => {
  let subscriber;
  try {
    subscriber = await subscriberService.getSubscriberById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find subscriber' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.subscriber = subscriber;
  next();
};

module.exports = {
  getAllSubscribers,
  createSubscriber,
  getSubscriberById,
  updateSubscriber,
  deleteSubscriber,
  getSubscriber
};
