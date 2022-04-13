import { getRepository, Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import IAccountRepository from '../../../repositories/IAccountRepository';
import Account from '../entities/Account';

class AccountsRepository implements IAccountRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  public async create(cpf: string): Promise<Account> {
    const account = this.ormRepository.create({
      cpf,
      account: uuid(),
      agency: '0100',
      balance: 0
    });

    await this.ormRepository.save(account);

    return account;
  }

  public async findByCpf(cpf: string): Promise<Account | undefined> {
    const account = await this.ormRepository.findOne({
      where: { cpf }
    });

    return account;
  }

  public async save(account: Account): Promise<Account> {
    const savedAccount = await this.ormRepository.save(account);

    return savedAccount;
  }
}

export default AccountsRepository;
