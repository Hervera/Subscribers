const express = require('express');
const { port } = require('./config/env');
const connectDatabase = require('./config/database');
const logger = require('./config/logger');
const subscriberRouter = require('./routes/subscribers');

const app = express();

app.use(express.json());
app.use('/subscribers', subscriberRouter);

connectDatabase()
  .then(() => {
    app.listen(port, () => logger.info(`Server is running on port ${port}`));
  })
  .catch((err) => {
    logger.error('Failed to connect to the database:', err.message);
    process.exit(1);
  });
