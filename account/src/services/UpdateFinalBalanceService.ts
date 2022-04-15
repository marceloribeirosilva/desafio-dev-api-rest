import IAccountRepository from 'repositories/IAccountRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class UpdateFinalBalanceService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository
  ) {}

  public async execute(cpf: string, final_balance: number): Promise<void> {
    const account = await this.accountsRepository.findByCpf(cpf);

    if (account) {
      account.balance = final_balance;

      await this.accountsRepository.save(account);
    }
  }
}
