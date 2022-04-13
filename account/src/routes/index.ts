import { Router } from 'express';
import AccountController from 'infra/http/controllers/AccountController';
import ensureAuthenticated from 'infra/http/middlewares/ensureAuthenticated';

const accountController = new AccountController();

const routes = Router();
routes.use(ensureAuthenticated);

routes.get('/', accountController.get);
routes.post('/create', accountController.create);

export default routes;
