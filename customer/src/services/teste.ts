import { Kafka } from 'kafkajs';

async function ExampleConsumer(): Promise<void> {
  const clientId = 'dock';

  const brokers = ['127.0.0.1:32895'];

  const topic = 'create-account';

  const kafka = new Kafka({ clientId, brokers });

  const consumer = kafka.consumer({ groupId: clientId });

  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('TESTESTESTESTESTESTSE =====>', message.value?.toString());
    }
  });
}

export default ExampleConsumer;
