import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import CreateAccountServiceProducer from 'services/CreateAccountServiceProducer';
import { container } from 'tsyringe';
import CreateCustomerService from '../../../services/CreateCustomerService';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, cpf, email, password } = request.body;

    const createCustomer = container.resolve(CreateCustomerService);

    const customer = await createCustomer.execute({
      name,
      cpf,
      email,
      password
    });

    await CreateAccountServiceProducer.execute(customer.cpf);

    return response.status(201).json(classToClass(customer));
  }
}
