import type { RequestHandler } from 'express';
import { subscriberService } from '../services/subscribers';

// Loads the subscriber for req.params.id into res.subscriber, or responds 404
export const getSubscriber: RequestHandler<{ id: string }> = async (req, res, next) => {
  const subscriber = await subscriberService.getSubscriberById(req.params.id);
  if (subscriber == null) {
    res.status(404).json({ message: 'Cannot find subscriber' });
    return;
  }

  res.subscriber = subscriber;
  next();
};
