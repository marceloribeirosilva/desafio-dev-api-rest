import { inject, injectable } from 'tsyringe';
import AppError from '../errors/AppError';
import Account from '../infra/typeorm/entities/Account';
import IAccountRepository from '../repositories/IAccountRepository';

interface IRequest {
  cpf: string;
}

@injectable()
class CreateAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository
  ) {}

  public async execute({ cpf }: IRequest): Promise<Account> {
    const modifiedCpf = cpf;
    const checkAccountExists_cpf = await this.accountsRepository.findByCpf(
      modifiedCpf
    );

    if (checkAccountExists_cpf) {
      throw new AppError('Existing account for this cpf already used');
    }

    const account = await this.accountsRepository.create(modifiedCpf);

    return account;
  }
}

export default CreateAccountService;
