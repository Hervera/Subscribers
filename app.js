const express = require('express');
const subscriberRouter = require('./routes/subscribers');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/subscribers', subscriberRouter);

// Must come after all routes
app.use(errorHandler);

module.exports = app;
