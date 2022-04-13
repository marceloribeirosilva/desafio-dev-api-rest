import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { inject, injectable } from 'tsyringe';
import AppError from '../errors/AppError';
import Customer from '../infra/typeorm/entities/Customer';
import IHashProvider from '../providers/HashProvider/interfaces/IHashProvider';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    cpf,
    email,
    password
  }: IRequest): Promise<Customer> {
    if (!name) throw new AppError('Name field is empty');

    if (!cpf) throw new AppError('CPF field is empty');

    if (!cpfValidator.isValid(cpf)) throw new AppError('CPF is not valid');

    if (!email) throw new AppError('E-mail field is empty');

    if (!password) throw new AppError('Password field is empty');

    const checkCustomerExists_email = await this.customersRepository.findByEmail(
      email
    );

    if (checkCustomerExists_email) {
      throw new AppError('Email address already used');
    }

    const modifiedCpf = cpf;
    const checkCustomerExists_cpf = await this.customersRepository.findByCpf(
      modifiedCpf
    );

    if (checkCustomerExists_cpf) {
      throw new AppError('Cpf already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const customer = await this.customersRepository.create({
      name,
      cpf: modifiedCpf,
      email,
      password: hashedPassword
    });

    return customer;
  }
}

export default CreateCustomerService;
