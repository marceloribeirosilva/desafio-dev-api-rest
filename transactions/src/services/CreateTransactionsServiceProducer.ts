import AppError from 'errors/AppError';
import { Kafka } from 'kafkajs';

export default class CreateTransactionsServiceProducer {
  static async execute(cpf: string, final_balance: number): Promise<void> {
    const clientId = 'dock';
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
            value: JSON.stringify({ cpf, final_balance })
          }
        ]
      });
    } catch (err) {
      throw new AppError('Unable to registry transactions');
    }
  }
}
