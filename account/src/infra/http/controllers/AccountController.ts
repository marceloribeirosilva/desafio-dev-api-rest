import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAccountService from '../../../services/CreateAccountService';

export default class AccountController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { cpf } = request.body;

    const createAccount = container.resolve(CreateAccountService);

    const account = await createAccount.execute({ cpf });

    return response.status(201).json(account);
  }

  public async createKafka(cpf: string): Promise<void> {
    const createAccount = container.resolve(CreateAccountService);

    await createAccount.execute({ cpf });
  }
}
