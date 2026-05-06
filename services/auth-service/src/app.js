require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initializeDatabase } = require('./config/db');

const app = express();
const PORT = process.env.AUTH_PORT || 3001;

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check — no auth required
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

// Start server after DB initialisation
async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`[auth-service] listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(`[auth-service] Failed to start: ${err.message}`);
    process.exit(1);
  }
}

start();
