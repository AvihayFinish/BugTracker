import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter.js';
import bugRouter from './routes/bugRouter.js';
import { notFound, 
        errorHandler } from './midlleware/errorMidlleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
dotenv.config();
const port = process.env.PORT || 8000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(cookieParser());

app.use('/users', limiter, userRouter);
app.use('/bugs', bugRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});