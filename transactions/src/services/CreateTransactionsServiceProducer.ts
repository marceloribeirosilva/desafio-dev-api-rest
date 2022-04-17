import AppError from 'errors/AppError';
import { Kafka } from 'kafkajs';

export default class CreateTransactionsServiceProducer {
  static async execute(cpf: string, final_balance: number): Promise<void> {
    const clientId = process.env.CLIENT_ID_UPDATE_ACCOUNT_KAFKA || '';
    const brokers = [
      `${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}` || ''
    ];
    const topic = process.env.TOPIC_UPDATE_ACCOUNT_KAFKA || '';

    const kafka = new Kafka({ clientId, brokers });
    const producer = kafka.producer();

    await producer.connect();
    try {
      await producer.send({
        topic,
        messages: [
          {
            key: cpf,
            value: JSON.stringify({ cpf, final_balance })
          }
        ]
      });
    } catch (err) {
      throw new AppError('Unable to registry transactions');
    }
  }
}
