import type { SubscriberDocument } from '../models/subscriber';

declare global {
  namespace Express {
    interface Response {
      // Set by the getSubscriber middleware on /:id routes
      subscriber?: SubscriberDocument;
    }
  }
}

export {};
