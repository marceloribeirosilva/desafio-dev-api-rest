import AppError from 'errors/AppError';
import { Kafka } from 'kafkajs';

export default class CreateAccountServiceProducer {
  static async execute(cpf: string): Promise<void> {
    const clientId = 'dock';
    const brokers = ['127.0.0.1:32895'];
    const topic = 'create-account';

    const kafka = new Kafka({ clientId, brokers });
    const producer = kafka.producer();

    await producer.connect();
    try {
      await producer.send({
        topic,
        messages: [
          {
            key: cpf,
            value: cpf
          }
        ]
      });
    } catch (err) {
      throw new AppError('Unable to create account');
    }
  }
}
