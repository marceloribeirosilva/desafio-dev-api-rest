import AppError from 'errors/AppError';
import { Kafka } from 'kafkajs';

export default class CreateAccountServiceProducer {
  static async execute(cpf: string): Promise<void> {
    const clientId = process.env.CLIENT_ID_CREATE_ACCOUNT_KAFKA || '';
    const brokers = [process.env.BROKERS_KAFKA || ''];
    const topic = process.env.TOPIC_CREATE_ACCOUNT_KAFKA || '';

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
