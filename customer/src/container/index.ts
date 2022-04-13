import { container } from 'tsyringe';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';
import '../providers';
import ICustomersRepository from '../repositories/ICustomersRepository';

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository
);
