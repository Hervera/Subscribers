import mongoose, { type HydratedDocument } from 'mongoose';

export interface ISubscriber {
  name: string;
  subscribedToChannel: string;
  subscribeDate: Date;
}

export type SubscriberDocument = HydratedDocument<ISubscriber>;

const subscriberSchema = new mongoose.Schema<ISubscriber>({
  name: {
    type: String,
    required: true
  },
  subscribedToChannel: {
    type: String,
    required: true
  },
  subscribeDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

export default mongoose.model<ISubscriber>('Subscriber', subscriberSchema);
