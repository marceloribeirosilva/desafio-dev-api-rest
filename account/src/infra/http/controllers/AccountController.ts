import { Request, Response } from 'express';
import DisableAccountService from 'services/DisableAccountService';
import GetAccountService from 'services/GetAccountService';
import { container } from 'tsyringe';
import CreateAccountService from '../../../services/CreateAccountService';

export default class AccountController {
  public async get(request: Request, response: Response): Promise<Response> {
    const { cpf } = request;

    const getAccount = container.resolve(GetAccountService);

    const account = await getAccount.execute(cpf);

    return response.status(200).json(account);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { cpf } = request;

    const createAccount = container.resolve(CreateAccountService);

    const account = await createAccount.execute({ cpf });

    return response.status(201).json(account);
  }

  public async disableAccount(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { cpf } = request;

    const disableAccount = container.resolve(DisableAccountService);

    disableAccount.execute(cpf);

    return response.status(204).json({});
  }

  public async createKafka(cpf: string): Promise<void> {
    const createAccount = container.resolve(CreateAccountService);

    await createAccount.execute({ cpf });
  }
}
