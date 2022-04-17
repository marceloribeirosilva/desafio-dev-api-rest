import ICreateTransactionsDTO from 'dtos/ICreateTransactionsDTO';
import Transactions from '../infra/typeorm/entities/Transactions';

export default interface ITransactionsRepository {
  create(transactionDTO: ICreateTransactionsDTO): Promise<Transactions>;
  save(transactions: Transactions): Promise<Transactions>;
  getTotalTransactionsDay(
    cpf: string,
    date: Date,
    type: string
  ): Promise<number>;
  getStatement(
    cpf: string,
    initial_date: Date,
    final_date: Date
  ): Promise<Transactions[] | undefined>;
}
