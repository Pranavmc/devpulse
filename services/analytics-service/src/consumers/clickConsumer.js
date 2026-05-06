const { createConsumer } = require('../config/kafka');
const ClickEvent = require('../models/ClickEvent');

async function startClickConsumer() {
  try {
    const consumer = await createConsumer();
    await consumer.connect();
    await consumer.subscribe({ topic: 'url-clicked', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const event = JSON.parse(message.value.toString());

          await ClickEvent.insert({
            shortCode: event.shortCode,
            userId: event.userId,
            originalUrl: event.originalUrl,
            ipAddress: event.ip,
            userAgent: event.userAgent,
            clickedAt: event.timestamp ? new Date(event.timestamp) : new Date(),
          });

          console.log(`[analytics-service] Stored click event for ${event.shortCode}`);
        } catch (err) {
          console.error(`[analytics-service] Error processing message: ${err.message}`);
          // Do not throw — consumer must not crash
        }
      },
    });

    console.log('[analytics-service] Kafka click consumer running');
  } catch (err) {
    console.error(`[analytics-service] Failed to start Kafka consumer: ${err.message}`);
    // Retry after delay — do not crash the process
    setTimeout(() => {
      console.log('[analytics-service] Retrying Kafka consumer start...');
      startClickConsumer();
    }, 10000);
  }
}

module.exports = { startClickConsumer };
