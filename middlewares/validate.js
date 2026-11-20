// Checks req.body against a Joi schema before the request reaches the controller.
// Unknown fields are dropped, and req.body is replaced with the validated value.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body ?? {}, {
    abortEarly: false,
    stripUnknown: true,
    errors: { wrap: { label: false } }
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  req.body = value;
  next();
};

module.exports = { validate };
