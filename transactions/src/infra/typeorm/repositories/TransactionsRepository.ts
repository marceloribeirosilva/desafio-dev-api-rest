import ICreateTransactionsDTO from 'dtos/ICreateTransactionsDTO';
import { getRepository, Repository } from 'typeorm';
import ITransactionsRepository from '../../../repositories/ITransactionsRepository';
import Transactions from '../entities/Transactions';

class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transactions>;

  constructor() {
    this.ormRepository = getRepository(Transactions);
  }

  public async create(
    transactionDTO: ICreateTransactionsDTO
  ): Promise<Transactions> {
    const transaction = this.ormRepository.create({
      account: transactionDTO.account,
      agency: transactionDTO.agency,
      current_balance: transactionDTO.current_balance,
      final_balance: transactionDTO.final_balance,
      value_transaction: transactionDTO.value_transaction,
      type: transactionDTO.type_transaction,
      cpf: transactionDTO.cpf
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async save(transaction: Transactions): Promise<Transactions> {
    const savedTransactions = await this.ormRepository.save(transaction);

    return savedTransactions;
  }
}

export default TransactionsRepository;
