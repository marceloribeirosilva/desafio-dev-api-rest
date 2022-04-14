import { inject, injectable } from 'tsyringe';
import Account from 'infra/typeorm/entities/Account';
import IAccountRepository from 'repositories/IAccountRepository';

@injectable()
export default class GetAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository
  ) {}

  public async execute(cpf: string): Promise<Account | undefined> {
    return this.accountsRepository.findByCpf(cpf);
  }
}
