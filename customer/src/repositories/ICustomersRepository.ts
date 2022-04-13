import ICreateCustomerDTO from '../dtos/ICreateCustomerDTO';
import Customer from '../infra/typeorm/entities/Customer';

export default interface ICustomersRepository {
  create(data: ICreateCustomerDTO): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | undefined>;
  findByCpf(cpf: string): Promise<Customer | undefined>;
  findByID(id: number): Promise<Customer | undefined>;
  save(user: Customer): Promise<Customer>;
}
