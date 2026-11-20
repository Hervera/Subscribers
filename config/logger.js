const { logLevel } = require('./env');

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const threshold = levels[logLevel] ?? levels.info;

const output = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.log
};

const log = (level, args) => {
  if (levels[level] > threshold) return;
  output[level](`[${new Date().toISOString()}] ${level.toUpperCase()}:`, ...args);
};

module.exports = {
  error: (...args) => log('error', args),
  warn: (...args) => log('warn', args),
  info: (...args) => log('info', args),
  debug: (...args) => log('debug', args)
};
