import AppError from '../../src/errors/AppError';
import FakeHashProvider from '../../src/providers/HashProvider/fake/FakeHashProvider';
import FakeCustomersRepository from '../../src/repositories/fake/FakeCustomersRepository';
import AuthenticateCustomerService from '../../src/services/AuthenticateCustomerService';
import CreateCustomerService from '../../src/services/CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateCustomer: AuthenticateCustomerService;
let createCustomer: CreateCustomerService;

describe('AuthenticateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateCustomer = new AuthenticateCustomerService(
      fakeCustomersRepository,
      fakeHashProvider
    );

    createCustomer = new CreateCustomerService(
      fakeCustomersRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      cpf: '209.199.930-01',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const response = await authenticateCustomer.execute({
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing customer', async () => {
    await expect(
      authenticateCustomer.execute({
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createCustomer.execute({
      name: 'John Doe',
      cpf: '209.199.930-01',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      authenticateCustomer.execute({
        email: 'johndoe@example.com',
        password: '123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
