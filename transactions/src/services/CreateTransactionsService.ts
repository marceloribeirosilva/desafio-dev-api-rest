import AppError from 'errors/AppError';
import { inject, injectable } from 'tsyringe';
// import AppError from '../errors/AppError';
import Transactions from '../infra/typeorm/entities/Transactions';
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
  }: IRequest): Promise<Transactions> {
    if (!account_active) throw new AppError('The account is not active');

    if (account_block) throw new AppError('The account is blocked');

    let final_balance = current_balance;

    if (type_transaction === 'C') {
      final_balance += value_transaction;
    }

    if (type_transaction === 'D') {
      if (value_transaction > final_balance)
        throw new AppError('Balance unavailable for this transaction');

      const totalDebitTransactionsDay = await this.transactionsRepository.getTotalTransactionsDay(
        cpf,
        new Date(),
        'D'
      );

      if (totalDebitTransactionsDay + value_transaction > 2000)
        throw new AppError('Transaction amount exceeds daily limit');

      final_balance -= value_transaction;
    }

    const transaction = await this.transactionsRepository.create({
      cpf,
      account: account_number,
      agency,
      current_balance,
      account_active,
      account_block,
      value_transaction,
      type_transaction,
      final_balance
    });

    CreateTransactionsServiceProducer.execute(
      transaction.cpf,
      transaction.final_balance
    );

    return transaction;
  }
}

export default CreateTransactionsService;
