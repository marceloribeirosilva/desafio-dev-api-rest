import AccountController from 'infra/http/controllers/AccountController';
import { Kafka } from 'kafkajs';

async function CreateAccountConsumerService(): Promise<void> {
  const clientId = process.env.CLIENT_ID_CREATE_ACCOUNT_KAFKA || '';

  const brokers = [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}` || ''];

  const topic = process.env.TOPIC_CREATE_ACCOUNT_KAFKA || '';

  const kafka = new Kafka({ clientId, brokers });

  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const controller = new AccountController();
        controller.createKafka(message.value.toString());
      }
    }
  });
}

export default CreateAccountConsumerService;
