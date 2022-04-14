import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTransactionsService from '../../../services/CreateTransactionsService';

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

    const transaction = await createTransactions.execute({
      cpf,
      account_number,
      agency,
      current_balance,
      account_active,
      account_block,
      value_transaction,
      type_transaction
    });

    return response.status(201).json(transaction);
  }
}
