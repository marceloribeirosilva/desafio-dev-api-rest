import TransactionsController from 'infra/http/controllers/TransactionsController';
import { Kafka } from 'kafkajs';

async function CreateTransactionsConsumerService(): Promise<void> {
  const clientId = 'dock-transactions';

  const brokers = ['127.0.0.1:9092'];

  const topic = 'create-transactions';

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
