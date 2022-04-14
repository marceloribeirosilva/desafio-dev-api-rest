import { inject, injectable } from 'tsyringe';
import IAccountRepository from 'repositories/IAccountRepository';

@injectable()
export default class DisableAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository
  ) {}

  public async execute(cpf: string): Promise<void> {
    const account = await this.accountsRepository.findByCpf(cpf);

    if (account) {
      account.active = false;

      await this.accountsRepository.save(account);
    }
  }
}
