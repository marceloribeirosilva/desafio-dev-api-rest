export default interface ICreateTransactionsDTO {
  account: string;
  agency: string;
  cpf: string;
  current_balance: number;
  final_balance: number;
  account_active: boolean;
  account_block: boolean;
  value_transaction: number;
  type_transaction: string;
}
