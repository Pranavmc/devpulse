require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middleware/errorHandler');
const { connectMongo } = require('./config/db');
const { getRedisClient } = require('./config/redis');
const { connectKafka } = require('./config/kafka');

const app = express();
const PORT = process.env.URL_PORT || 3002;

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'url-service' });
});

// Routes
app.use(urlRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await connectMongo();

    // Redis — initialise client (non-blocking; graceful degradation)
    try {
      getRedisClient();
    } catch (err) {
      console.error(`[url-service] Redis init error: ${err.message}`);
    }

    // Kafka producer — non-blocking
    try {
      await connectKafka();
    } catch (err) {
      console.error(`[url-service] Kafka init error: ${err.message}`);
    }

    app.listen(PORT, () => {
      console.log(`[url-service] listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(`[url-service] Failed to start: ${err.message}`);
    process.exit(1);
  }
}

start();
