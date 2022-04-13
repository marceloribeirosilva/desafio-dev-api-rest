import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';
import Customer from '../infra/typeorm/entities/Customer';
import IHashProvider from '../providers/HashProvider/interfaces/IHashProvider';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class AuthenticateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    email,
    password
  }: IRequest): Promise<{ customer: Customer; token: string }> {
    const customer = await this.customersRepository.findByEmail(email);

    if (!customer) {
      throw new AppError('Incorrect email or password', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      customer.password
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email or password', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ cpf: customer.cpf }, secret, {
      expiresIn
    });

    return { customer, token };
  }
}

export default AuthenticateCustomerService;
