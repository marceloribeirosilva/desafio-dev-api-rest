import AppError from 'errors/AppError';
import { Kafka } from 'kafkajs';

interface ICreateTransactionMessageKafka {
  cpf: string;
  account_number: string;
  agency: string;
  current_balance: number;
  account_active: boolean;
  account_block: boolean;
  value_transaction: number;
  type_transaction: string;
}

export default class CreateTransactionsServiceProducer {
  static async execute({
    cpf,
    account_number,
    agency,
    current_balance,
    account_active,
    account_block,
    value_transaction,
    type_transaction
  }: ICreateTransactionMessageKafka): Promise<void> {
    const clientId = 'dock-transactions';
    const brokers = ['127.0.0.1:9092'];
    const topic = 'create-transactions';

    const kafka = new Kafka({ clientId, brokers });
    const producer = kafka.producer();

    await producer.connect();
    try {
      await producer.send({
        topic,
        messages: [
          {
            key: cpf,
            value: JSON.stringify({
              cpf,
              account_number,
              agency,
              current_balance,
              account_active,
              account_block,
              value_transaction,
              type_transaction
            })
          }
        ]
      });
    } catch (err) {
      throw new AppError('Unable to registry transactions');
    }
  }
}
