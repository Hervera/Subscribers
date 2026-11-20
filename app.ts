import express from 'express';
import subscriberRouter from './routes/subscribers';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use('/subscribers', subscriberRouter);

// Must come after all routes
app.use(errorHandler);

export default app;
