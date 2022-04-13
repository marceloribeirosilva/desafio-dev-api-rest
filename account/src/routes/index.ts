import { Router } from 'express';
import ensureAuthenticated from 'infra/http/middlewares/ensureAuthenticated';
import accountRouter from '../infra/http/routes/account.routes';

const routes = Router();
routes.use(ensureAuthenticated);

routes.use('/create', accountRouter);

export default routes;
