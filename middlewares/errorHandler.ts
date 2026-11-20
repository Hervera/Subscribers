import type { ErrorRequestHandler } from 'express';

interface HttpError extends Error {
  status?: number;
}

// Turns any error thrown in an async handler (or passed to next) into a JSON response
const errorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  // Mongoose validation errors are client errors, as the old per-route handlers returned
  const status = err.name === 'ValidationError' ? 400 : err.status || 500;

  res.status(status).json({ message: err.message });
};

export default errorHandler;
