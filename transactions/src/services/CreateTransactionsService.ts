import { inject, injectable } from 'tsyringe';
// import AppError from '../errors/AppError';
import Transactions from '../infra/typeorm/entities/Transactions';
import ITransactionsRepository from '../repositories/ITransactionsRepository';

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
    let final_balance = current_balance;
    if (type_transaction === 'C') {
      final_balance += value_transaction;
    }

    if (type_transaction === 'D') {
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

    return transaction;
  }
}

export default CreateTransactionsService;
