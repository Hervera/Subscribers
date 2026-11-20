const { mock } = require('node:test');

// A fake Express response that records calls to status() and json()
const mockResponse = () => {
  const res = { headersSent: false };
  res.status = mock.fn(() => res);
  res.json = mock.fn(() => res);
  return res;
};

// Arguments of the first call to a mock function
const firstCallArgs = (fn) => fn.mock.calls[0].arguments;

module.exports = { mockResponse, firstCallArgs };
