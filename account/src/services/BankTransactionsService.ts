import { container } from 'tsyringe';
import CreateTransactionsServiceProducer from './CreateTransactionsServiceProducer';
import GetAccountService from './GetAccountService';

export default class BankTransactionsService {
  public async execute(
    cpf: string,
    value: number,
    type: string
  ): Promise<void> {
    const getAccount = container.resolve(GetAccountService);

    const account = await getAccount.execute(cpf);

    if (account) {
      if (!account.active) {
        return;
      }

      if (account.block) {
        return;
      }

      CreateTransactionsServiceProducer.execute({
        account_number: account.account,
        agency: account.agency,
        cpf,
        current_balance: account.balance,
        type_transaction: type,
        value_transaction: value
      });
    }
  }
}
