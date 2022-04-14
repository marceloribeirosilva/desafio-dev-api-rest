import { inject, injectable } from 'tsyringe';
import IAccountRepository from 'repositories/IAccountRepository';

@injectable()
export default class BlockAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository
  ) {}

  public async execute(cpf: string): Promise<void> {
    const account = await this.accountsRepository.findByCpf(cpf);

    if (account) {
      account.block = !account.block;

      await this.accountsRepository.save(account);
    }
  }
}
