// Turns any error thrown in an async handler (or passed to next) into a JSON response
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Mongoose validation errors are client errors, as the old per-route handlers returned
  const status = err.name === 'ValidationError' ? 400 : err.status || 500;

  res.status(status).json({ message: err.message });
};

module.exports = errorHandler;
