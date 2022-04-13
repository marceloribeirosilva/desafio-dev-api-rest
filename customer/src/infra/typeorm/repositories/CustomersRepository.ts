import { getRepository, Repository } from 'typeorm';
import ICreateCustomerDTO from '../../../dtos/ICreateCustomerDTO';
import ICustomersRepository from '../../../repositories/ICustomersRepository';
import Customer from '../entities/Customer';

class CustomersRepository implements ICustomersRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async create(data: ICreateCustomerDTO): Promise<Customer> {
    const customer = this.ormRepository.create(data);

    await this.ormRepository.save(customer);

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { email }
    });

    return customer;
  }

  public async findByCpf(cpf: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: { cpf }
    });

    return customer;
  }

  public async findByID(id: number): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne(id);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const savedCustomer = await this.ormRepository.save(customer);

    return savedCustomer;
  }
}

export default CustomersRepository;
