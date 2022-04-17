import { Request, Response } from 'express';
import GetStatementService from 'services/GetStatementService';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';
import CreateTransactionsService from '../../../services/CreateTransactionsService';

interface ICreateTransactionMessageKafka {
  cpf: string;
  account_number: string;
  agency: string;
  current_balance: number;
  value_transaction: number;
  type_transaction: string;
}

export default class TransactionsController {
  public async get(request: Request, response: Response): Promise<Response> {
    const { cpf } = request;
    const { initial_date, final_date } = request.query;
    let initialDate = new Date();
    let finalDate = new Date();
    if (initial_date) {
      initialDate = parseISO(initial_date.toString());
    }
    if (final_date) {
      finalDate = parseISO(final_date.toString());
    }

    const getStatement = container.resolve(GetStatementService);

    const transactions = await getStatement.execute(
      cpf,
      initialDate,
      finalDate
    );

    return response.status(200).json(transactions);
  }

  public async createKafka(message: string): Promise<void> {
    const messageCreateTransactions: ICreateTransactionMessageKafka = JSON.parse(
      message
    );

    const createTransactions = container.resolve(CreateTransactionsService);

    await createTransactions.execute({ ...messageCreateTransactions });
  }
}
