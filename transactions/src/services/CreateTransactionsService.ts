import { inject, injectable } from 'tsyringe';
import ITransactionsRepository from '../repositories/ITransactionsRepository';
import CreateTransactionsServiceProducer from './CreateTransactionsServiceProducer';

interface IRequest {
  cpf: string;
  account_number: string;
  agency: string;
  current_balance: number;
  account_active: boolean;
  account_block: boolean;
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
    account_active,
    account_block,
    value_transaction,
    type_transaction
  }: IRequest): Promise<void> {
    if (!account_active) {
      // throw new AppError('The account is not active');
      // gravar mensagem
      return;
    }

    if (account_block) {
      // throw new AppError('The account is blocked');
      return;
    }

    let final_balance = Number(current_balance);
    const value = Number(value_transaction);

    if (type_transaction === 'C') {
      final_balance += value;
    }

    if (type_transaction === 'D') {
      if (value > final_balance) {
        // throw new AppError('Balance unavailable for this transaction');
        return;
      }

      const totalDebitTransactionsDay = await this.transactionsRepository.getTotalTransactionsDay(
        cpf,
        new Date(),
        'D'
      );

      if (totalDebitTransactionsDay + value > 2000) {
        // throw new AppError('Transaction amount exceeds daily limit');
        return;
      }

      final_balance -= value;
    }

    const transaction = await this.transactionsRepository.create({
      cpf,
      account: account_number,
      agency,
      current_balance,
      account_active,
      account_block,
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
