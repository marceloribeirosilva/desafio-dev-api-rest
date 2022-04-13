import { uuid } from 'uuidv4';
import ICreateCustomerDTO from '../../dtos/ICreateCustomerDTO';
import Customer from '../../infra/typeorm/entities/Customer';
import ICustomersRepository from '../ICustomersRepository';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async create(data: ICreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, { id: uuid() }, data);

    this.customers.push(customer);

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find(
      customerFind => customerFind.email === email
    );

    return customer;
  }

  public async findByCpf(cpf: string): Promise<Customer | undefined> {
    const customer = this.customers.find(
      customerFind => customerFind.cpf === cpf
    );

    return customer;
  }

  public async findByID(id: number): Promise<Customer | undefined> {
    const customer = this.customers.find(
      customerFind => customerFind.id === id
    );

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const findIndex = this.customers.findIndex(
      customerFind => customerFind.id === customer.id
    );

    this.customers[findIndex] = customer;

    return customer;
  }
}

export default FakeCustomersRepository;
