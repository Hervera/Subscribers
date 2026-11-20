import mongoose from 'mongoose';
import { databaseUrl } from './env';
import logger from './logger';

const connectDatabase = async () => {
  await mongoose.connect(databaseUrl);
  logger.info('Connected to the database');

  // Report problems that happen after the initial connection
  mongoose.connection.on('error', (err: Error) => logger.error('Database error:', err.message));
  mongoose.connection.on('disconnected', () => logger.warn('Database disconnected'));
};

export default connectDatabase;
