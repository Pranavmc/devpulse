const { Kafka } = require('kafkajs');

let producer = null;
let connected = false;

async function connectKafka() {
  try {
    const kafka = new Kafka({
      clientId: 'url-service',
      brokers: [process.env.KAFKA_BROKER],
      retry: {
        initialRetryTime: 3000,
        retries: 5,
      },
    });

    producer = kafka.producer();
    await producer.connect();
    connected = true;
    console.log('[url-service] Kafka producer connected');
  } catch (err) {
    console.error(`[url-service] Kafka producer connection failed: ${err.message}`);
    connected = false;
  }
}

async function publishClickEvent(event) {
  if (!producer || !connected) {
    console.warn('[url-service] Kafka producer not available, skipping event');
    return;
  }

  try {
    await producer.send({
      topic: 'url-clicked',
      messages: [
        {
          key: event.shortCode,
          value: JSON.stringify(event),
        },
      ],
    });
  } catch (err) {
    console.error(`[url-service] Kafka send error: ${err.message}`);
    // Do NOT throw — redirect must not fail because of Kafka
  }
}

module.exports = { connectKafka, publishClickEvent };
