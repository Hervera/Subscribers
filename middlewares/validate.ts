import type { RequestHandler } from 'express';
import type { ObjectSchema } from 'joi';

// Checks req.body against a Joi schema before the request reaches the controller.
// Unknown fields are dropped, and req.body is replaced with the validated value.
export const validate = (schema: ObjectSchema): RequestHandler => (req, res, next) => {
  const { error, value } = schema.validate(req.body ?? {}, {
    abortEarly: false,
    stripUnknown: true,
    errors: { wrap: { label: false } }
  });

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  req.body = value;
  next();
};
