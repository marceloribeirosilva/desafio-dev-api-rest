import { inject, injectable } from 'tsyringe';
import IAccountRepository from '../repositories/IAccountRepository';

interface IRequest {
  cpf: string;
}

@injectable()
class CreateAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountRepository
  ) {}

  public async execute({ cpf }: IRequest): Promise<void> {
    const modifiedCpf = cpf;
    const checkAccountExists_cpf = await this.accountsRepository.findByCpf(
      modifiedCpf
    );

    if (checkAccountExists_cpf) {
      return;
    }

    await this.accountsRepository.create(modifiedCpf);
  }
}

export default CreateAccountService;
