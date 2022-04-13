// index, show, create, update, delete
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateCustomerService from '../../../services/AuthenticateCustomerService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateCustomer = container.resolve(AuthenticateCustomerService);

    const { customer, token } = await authenticateCustomer.execute({
      email,
      password
    });

    return response.json({ customer: classToClass(customer), token });
  }
}
