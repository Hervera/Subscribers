const Joi = require('joi');

// Mirrors the Subscriber model: both fields are required strings
const createSubscriberSchema = Joi.object({
  name: Joi.string().required(),
  subscribedToChannel: Joi.string().required()
});

// Only the fields that are sent get updated, so both are optional
const updateSubscriberSchema = Joi.object({
  name: Joi.string(),
  subscribedToChannel: Joi.string()
});

module.exports = { createSubscriberSchema, updateSubscriberSchema };
