import AccountController from 'infra/http/controllers/AccountController';
import { Kafka } from 'kafkajs';

async function CreateAccountConsumerService(): Promise<void> {
  const clientId = 'dock';

  const brokers = ['127.0.0.1:9092'];

  const topic = 'create-account';

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
