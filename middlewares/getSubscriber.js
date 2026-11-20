const subscriberService = require('../services/subscribers');

// Loads the subscriber for req.params.id into res.subscriber, or responds 404
const getSubscriber = async (req, res, next) => {
  const subscriber = await subscriberService.getSubscriberById(req.params.id);
  if (subscriber == null) {
    return res.status(404).json({ message: 'Cannot find subscriber' });
  }

  res.subscriber = subscriber;
  next();
};

module.exports = { getSubscriber };
