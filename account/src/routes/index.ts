import { Router } from 'express';
import accountRouter from '../infra/http/routes/account.routes';

const routes = Router();

routes.use('/create', accountRouter);

export default routes;
