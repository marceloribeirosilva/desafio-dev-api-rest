import { inject, injectable } from 'tsyringe';
import ITransactionsRepository from '../repositories/ITransactionsRepository';
import CreateTransactionsServiceProducer from './CreateTransactionsServiceProducer';

interface IRequest {
  cpf: string;
  account_number: string;
  agency: string;
  current_balance: number;
  value_transaction: number;
  type_transaction: string;
}

@injectable()
class CreateTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute({
    cpf,
    account_number,
    agency,
    current_balance,
    value_transaction,
    type_transaction
  }: IRequest): Promise<void> {
    let final_balance = Number(current_balance);
    const value = Number(value_transaction);

    if (type_transaction === 'C') {
      final_balance += value;
    }

    if (type_transaction === 'D') {
      if (value > final_balance) {
        return;
      }

      const totalDebitTransactionsDay = await this.transactionsRepository.getTotalTransactionsDay(
        cpf,
        new Date(),
        'D'
      );

      if (totalDebitTransactionsDay + value > 2000) {
        return;
      }

      final_balance -= value;
    }

    const transaction = await this.transactionsRepository.create({
      cpf,
      account: account_number,
      agency,
      current_balance,
      value_transaction: value,
      type_transaction,
      final_balance
    });

    CreateTransactionsServiceProducer.execute(
      transaction.cpf,
      transaction.final_balance
    );
  }
}

export default CreateTransactionsService;
