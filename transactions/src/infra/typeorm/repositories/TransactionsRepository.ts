import ICreateTransactionsDTO from 'dtos/ICreateTransactionsDTO';
import { getRepository, Repository, Between, Equal } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';
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

  public async getTotalTransactionsDay(
    cpf: string,
    date: Date,
    type: string
  ): Promise<number> {
    let total = 0;
    const transactions = await this.ormRepository.find({
      where: {
        created_at: Between(
          startOfDay(date).toISOString(),
          endOfDay(date).toISOString()
        ),
        cpf: Equal(cpf),
        type: Equal(type)
      }
    });

    if (transactions) {
      for (let index = 0; index < transactions.length; index += 1) {
        const transaction = transactions[index];

        total += Number(transaction.value_transaction);
      }
    }

    return total;
  }

  public async getStatement(
    cpf: string,
    initial_date: Date,
    final_date: Date
  ): Promise<Transactions[] | undefined> {
    return this.ormRepository.find({
      where: {
        created_at: Between(
          startOfDay(initial_date).toISOString(),
          endOfDay(final_date).toISOString()
        ),
        cpf: Equal(cpf)
      },
      order: {
        id: 'DESC'
      }
    });
  }
}

export default TransactionsRepository;
