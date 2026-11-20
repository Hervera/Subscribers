const app = require('./app');
const { port } = require('./config/env');
const connectDatabase = require('./config/database');
const logger = require('./config/logger');

connectDatabase()
  .then(() => {
    app.listen(port, () => logger.info(`Server is running on port ${port}`));
  })
  .catch((err) => {
    logger.error('Failed to connect to the database:', err.message);
    process.exit(1);
  });
