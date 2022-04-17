import TransactionsController from 'infra/http/controllers/TransactionsController';
import { Kafka } from 'kafkajs';

async function CreateTransactionsConsumerService(): Promise<void> {
  const clientId = process.env.CLIENT_ID_CREATE_TRANSACTIONS_KAFKA || '';

  const brokers = [process.env.BROKERS_KAFKA || ''];

  const topic = process.env.TOPIC_CREATE_TRANSACTIONS_KAFKA || '';

  const kafka = new Kafka({ clientId, brokers });

  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const controller = new TransactionsController();
        controller.createKafka(message.value.toString());
      }
    }
  });
}

export default CreateTransactionsConsumerService;
