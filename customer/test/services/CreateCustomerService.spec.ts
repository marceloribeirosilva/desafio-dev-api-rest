import AppError from '../../src/errors/AppError';
import FakeHashProvider from '../../src/providers/HashProvider/fake/FakeHashProvider';
import FakeCustomersRepository from '../../src/repositories/fake/FakeCustomersRepository';
import CreateCustomerService from '../../src/services/CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeHashProvider: FakeHashProvider;
let createCustomer: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeHashProvider = new FakeHashProvider();
    createCustomer = new CreateCustomerService(
      fakeCustomersRepository,
      fakeHashProvider
    );
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'John Doe',
      cpf: '209.199.930-01',
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create a new customer with same email from another', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      cpf: '209.199.930-01',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      createCustomer.execute({
        name: 'John Doe',
        cpf: '209.199.930-01',
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer with same cpf from another', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      cpf: '209.199.930-01',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      createCustomer.execute({
        name: 'John Doe',
        cpf: '209.199.930-01',
        email: 'johndoe2@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer if name field is empty', async () => {
    await expect(
      createCustomer.execute({
        name: '',
        cpf: '209.199.930-01',
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer if cpf field is empty', async () => {
    await expect(
      createCustomer.execute({
        name: 'John Doe',
        cpf: '',
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer if email field is empty', async () => {
    await expect(
      createCustomer.execute({
        name: 'John Doe',
        cpf: '209.199.930-01',
        email: '',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new customer if password field is empty', async () => {
    await expect(
      createCustomer.execute({
        name: 'John Doe',
        cpf: '209.199.930-01',
        email: 'johndoe@example.com',
        password: ''
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
