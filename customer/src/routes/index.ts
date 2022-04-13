import { Router } from 'express';
import customersRouter from '../infra/http/routes/customers.routes';
import sessionsRouter from '../infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/create', customersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
