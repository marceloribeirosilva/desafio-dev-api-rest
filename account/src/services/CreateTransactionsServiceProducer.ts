import AppError from 'errors/AppError';
import { Kafka } from 'kafkajs';

interface ICreateTransactionMessageKafka {
  cpf: string;
  account_number: string;
  agency: string;
  current_balance: number;
  value_transaction: number;
  type_transaction: string;
}

export default class CreateTransactionsServiceProducer {
  static async execute({
    cpf,
    account_number,
    agency,
    current_balance,
    value_transaction,
    type_transaction
  }: ICreateTransactionMessageKafka): Promise<void> {
    const clientId = process.env.CLIENT_ID_CREATE_TRANSACTIONS_KAFKA || '';
    const brokers = [
      `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}` || ''
    ];
    const topic = process.env.TOPIC_CREATE_TRANSACTIONS_KAFKA || '';

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
