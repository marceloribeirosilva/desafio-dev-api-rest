import { Router } from 'express';
import AccountController from 'infra/http/controllers/AccountController';
import ensureAuthenticated from 'infra/http/middlewares/ensureAuthenticated';

const accountController = new AccountController();

const routes = Router();

routes.get('/', ensureAuthenticated, accountController.get);
routes.post('/create', ensureAuthenticated, accountController.create);
routes.patch('/disable', ensureAuthenticated, accountController.disableAccount);

export default routes;
