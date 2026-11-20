// Rejects the request with 400 if any of the given body fields are missing or empty
const requireFields = (fields) => (req, res, next) => {
  const body = req.body ?? {};
  const missing = fields.filter((field) => body[field] == null || body[field] === '');

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  next();
};

module.exports = { requireFields };
