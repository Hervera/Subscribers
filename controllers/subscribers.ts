import type { RequestHandler } from 'express';
import { subscriberService } from '../services/subscribers';

// Errors thrown in these async handlers go to the global error handler (Express 5).
// The /:id handlers run after the getSubscriber middleware, which sets res.subscriber.

// Get all subscribers
export const getAllSubscribers: RequestHandler = async (req, res) => {
  const subscribers = await subscriberService.getAllSubscribers();
  res.json(subscribers);
};

// Create a new subscriber
export const createSubscriber: RequestHandler = async (req, res) => {
  const newSubscriber = await subscriberService.createSubscriber(req.body);
  res.status(201).json(newSubscriber);
};

// Get a single subscriber
export const getSubscriberById: RequestHandler = (req, res) => {
  res.json(res.subscriber);
};

// Update a subscriber
export const updateSubscriber: RequestHandler = async (req, res) => {
  const updatedSubscriber = await subscriberService.updateSubscriber(res.subscriber!, req.body);
  res.json(updatedSubscriber);
};

// Delete a subscriber
export const deleteSubscriber: RequestHandler = async (req, res) => {
  await subscriberService.deleteSubscriber(res.subscriber!);
  res.json({ message: 'Deleted Subscriber' });
};
