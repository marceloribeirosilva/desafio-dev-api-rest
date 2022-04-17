import Transactions from 'infra/typeorm/entities/Transactions';
import ITransactionsRepository from 'repositories/ITransactionsRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class GetStatementService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository
  ) {}

  public async execute(
    cpf: string,
    initial_date: Date,
    final_date: Date
  ): Promise<Transactions[] | undefined> {
    return this.transactionsRepository.getStatement(
      cpf,
      initial_date,
      final_date
    );
  }
}
