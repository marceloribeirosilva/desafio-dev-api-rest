import 'reflect-metadata';
import './infra/typeorm';
import './container';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import 'express-async-errors';
import AppError from './errors/AppError';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

app.listen(3335, () => {
  console.log('Server started');
});
