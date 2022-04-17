import { Router } from 'express';
import TransactionsController from 'infra/http/controllers/TransactionsController';
import ensureAuthenticated from 'infra/http/middlewares/ensureAuthenticated';

const transactionsController = new TransactionsController();

const routes = Router();
routes.use(ensureAuthenticated);

routes.get('/statement', transactionsController.get);

export default routes;
