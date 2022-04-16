import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTransactionsService from '../../../services/CreateTransactionsService';

interface ICreateTransactionMessageKafka {
  cpf: string;
  account_number: string;
  agency: string;
  current_balance: number;
  account_active: boolean;
  account_block: boolean;
  value_transaction: number;
  type_transaction: string;
}

export default class TransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { cpf } = request;
    const {
      account_number,
      agency,
      current_balance,
      account_active,
      account_block,
      value_transaction,
      type_transaction
    } = request.body;

    const createTransactions = container.resolve(CreateTransactionsService);

    await createTransactions.execute({
      cpf,
      account_number,
      agency,
      current_balance,
      account_active,
      account_block,
      value_transaction,
      type_transaction
    });

    return response.status(201).json({});
  }

  public async createKafka(message: string): Promise<void> {
    const messageCreateTransactions: ICreateTransactionMessageKafka = JSON.parse(
      message
    );

    const createTransactions = container.resolve(CreateTransactionsService);

    await createTransactions.execute({ ...messageCreateTransactions });
  }
}
