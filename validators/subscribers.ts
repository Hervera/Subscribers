import Joi from 'joi';

// Mirrors the Subscriber model: both fields are required strings
export const createSubscriberSchema = Joi.object({
  name: Joi.string().required(),
  subscribedToChannel: Joi.string().required()
});

// Only the fields that are sent get updated, so both are optional
export const updateSubscriberSchema = Joi.object({
  name: Joi.string(),
  subscribedToChannel: Joi.string()
});
