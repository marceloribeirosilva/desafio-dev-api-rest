import { Router } from 'express';
import AccountController from '../controllers/AccountController';

const accountRouter = Router();
const accountController = new AccountController();

accountRouter.post('/', accountController.create);

export default accountRouter;
