const { Kafka } = require('kafkajs');

let kafka = null;
let consumer = null;
let connected = false;

function getKafkaInstance() {
  if (!kafka) {
    kafka = new Kafka({
      clientId: 'analytics-service',
      brokers: [process.env.KAFKA_BROKER],
      retry: {
        initialRetryTime: 3000,
        retries: 10,
      },
    });
  }
  return kafka;
}

function getConsumer() {
  return consumer;
}

function isKafkaConnected() {
  return connected;
}

async function createConsumer() {
  const k = getKafkaInstance();
  consumer = k.consumer({ groupId: 'analytics-group' });

  consumer.on('consumer.connect', () => {
    connected = true;
    console.log('[analytics-service] Kafka consumer connected');
  });

  consumer.on('consumer.disconnect', () => {
    connected = false;
    console.warn('[analytics-service] Kafka consumer disconnected');
  });

  consumer.on('consumer.crash', async (event) => {
    connected = false;
    console.error(`[analytics-service] Kafka consumer crashed: ${event.payload.error.message}`);
    // Auto-reconnect after delay
    setTimeout(async () => {
      try {
        console.log('[analytics-service] Attempting Kafka consumer reconnect...');
        await consumer.connect();
        await consumer.subscribe({ topic: 'url-clicked', fromBeginning: false });
      } catch (err) {
        console.error(`[analytics-service] Kafka reconnect failed: ${err.message}`);
      }
    }, 5000);
  });

  return consumer;
}

module.exports = { getKafkaInstance, createConsumer, getConsumer, isKafkaConnected };
