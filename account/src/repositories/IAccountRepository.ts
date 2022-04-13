import Account from '../infra/typeorm/entities/Account';

export default interface IAccountRepository {
  create(cpf: string): Promise<Account>;
  findByCpf(cpf: string): Promise<Account | undefined>;
  save(account: Account): Promise<Account>;
}
