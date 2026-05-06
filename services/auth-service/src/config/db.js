const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.AUTH_DB_URL,
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

        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      client.release();
      console.log('[auth-service] PostgreSQL connected & users table ready');
      return;
    } catch (err) {
      retries++;
      console.error(
        `[auth-service] DB connection attempt ${retries}/${MAX_RETRIES} failed: ${err.message}`
      );
      if (retries >= MAX_RETRIES) {
        throw new Error('[auth-service] Could not connect to PostgreSQL after max retries');
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

module.exports = { pool, initializeDatabase };
