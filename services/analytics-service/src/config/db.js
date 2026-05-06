const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.ANALYTICS_DB_URL,
});

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function initializeDatabase() {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const client = await pool.connect();

      await client.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE IF NOT EXISTS click_events (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          short_code VARCHAR(20) NOT NULL,
          user_id VARCHAR(100),
          original_url TEXT,
          ip_address VARCHAR(50),
          user_agent TEXT,
          clicked_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_click_events_short_code
          ON click_events (short_code);
      `);

      client.release();
      console.log('[analytics-service] PostgreSQL connected & click_events table ready');
      return;
    } catch (err) {
      retries++;
      console.error(
        `[analytics-service] DB connection attempt ${retries}/${MAX_RETRIES} failed: ${err.message}`
      );
      if (retries >= MAX_RETRIES) {
        throw new Error('[analytics-service] Could not connect to PostgreSQL after max retries');
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

module.exports = { pool, initializeDatabase };
