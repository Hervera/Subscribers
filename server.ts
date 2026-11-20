import app from './app';
import { port } from './config/env';
import connectDatabase from './config/database';
import logger from './config/logger';

connectDatabase()
  .then(() => {
    app.listen(port, () => logger.info(`Server is running on port ${port}`));
  })
  .catch((err: Error) => {
    logger.error('Failed to connect to the database:', err.message);
    process.exit(1);
  });
