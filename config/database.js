const mongoose = require('mongoose');
const { databaseUrl } = require('./env');
const logger = require('./logger');

const connectDatabase = async () => {
  await mongoose.connect(databaseUrl);
  logger.info('Connected to the database');

  // Report problems that happen after the initial connection
  mongoose.connection.on('error', (err) => logger.error('Database error:', err.message));
  mongoose.connection.on('disconnected', () => logger.warn('Database disconnected'));
};

module.exports = connectDatabase;
