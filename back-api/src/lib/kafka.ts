import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'spm-consumer',
  brokers: ['localhost:9092'],
});

export const consumer = kafka.consumer({
  groupId: 'spm-noauth-group',
});

export const producer = kafka.producer();

export async function connectKafka() {
  try {
    await consumer.connect();
    console.log('Kafka consumer connected successfully');

    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    throw error;
  }
}

export async function disconnectKafka() {
  try {
    await consumer.disconnect();
    await producer.disconnect();
    console.log('Kafka disconnected successfully');
  } catch (error) {
    console.error('Failed to disconnect from Kafka:', error);
  }
}

export async function consumeMessages(
  topic: string,
  callback: (message: string) => void
) {
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      const messageValue = message.value?.toString() || '';
      console.log(`Received message from topic ${topic}:`, messageValue);
      callback(messageValue);
    },
  });
}
