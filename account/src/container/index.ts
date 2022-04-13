import { container } from 'tsyringe';
import AccountsRepository from '../infra/typeorm/repositories/AccountsRepository';
import IAccountRepository from '../repositories/IAccountRepository';

container.registerSingleton<IAccountRepository>(
  'AccountsRepository',
  AccountsRepository
);
