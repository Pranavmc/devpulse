require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initializeDatabase } = require('./config/db');
const { isKafkaConnected } = require('./config/kafka');
const { startClickConsumer } = require('./consumers/clickConsumer');

const app = express();
const PORT = process.env.ANALYTICS_PORT || 3003;

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check — includes Kafka connection status
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'analytics-service',
    kafkaConnected: isKafkaConnected(),
  });
});

// Routes
app.use(analyticsRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await initializeDatabase();

    // Start Kafka consumer alongside HTTP server (non-blocking)
    startClickConsumer().catch((err) =>
      console.error(`[analytics-service] Kafka consumer init error: ${err.message}`)
    );

    app.listen(PORT, () => {
      console.log(`[analytics-service] listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(`[analytics-service] Failed to start: ${err.message}`);
    process.exit(1);
  }
}

start();
